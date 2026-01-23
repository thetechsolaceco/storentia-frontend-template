'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, MapPin, User, Loader2, Package, ShoppingBag, Upload, Eye } from "lucide-react";
import { motion } from "framer-motion";
import Link from 'next/link';
import {
  getAllAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getUserProfile,
  updateUserProfile,
  getOrders,
  type Address,
  type CreateAddressRequest,
  type UserProfile,
  type Order,
} from "@/lib/apiClients";

const ORDER_STATUS_STEPS = [
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'PROCESSING', label: 'Processing' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'DELIVERED', label: 'Delivered' },
];

const CANCELLED_STATUSES = ['CANCELLED', 'REFUNDED'];

export default function ProfilePage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '' });
  const [addressSaving, setAddressSaving] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  // Form state for new/edit address
  const [formData, setFormData] = useState<CreateAddressRequest>({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    phone: '',
    isDefault: false,
  });

  useEffect(() => {
    loadUser();
    loadAddresses();
    loadOrders();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const result = await getOrders();
      if (result.success && result.data) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadUser = async () => {
    setUserLoading(true);
    try {
      const result = await getUserProfile();
      if (result.success && result.data) {
        const userData = 'user' in result.data ? result.data.user : result.data;
        setUser(userData as UserProfile);
        setProfileForm({
          name: userData.name || '',
        });
        setAvatarPreview(userData.avatar || '');
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setUserLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setProfileSaving(true);
    try {
      // In a real implementation, you'd upload the file to a storage service first
      // and get back a URL, then pass that URL to updateUserProfile
      const avatarUrl = avatarPreview; // Replace with actual upload logic
      
      const result = await updateUserProfile({
        name: profileForm.name,
        avatar: avatarUrl || undefined,
      });
      
      if (result.success) {
        await loadUser();
        setIsEditProfileOpen(false);
        setError('');
        setAvatarFile(null);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('An error occurred while updating profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const result = await getAllAddresses();
      
      if (result.success && result.data) {
        const addressData = Array.isArray(result.data) ? result.data : [];
        setAddresses(addressData);
      } else {
        setAddresses([]);
        setError(result.error || 'Failed to load addresses');
      }
    } catch (error) {
      setAddresses([]);
      setError('An error occurred while loading addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAddress = async () => {
    setAddressSaving(true);
    try {
      const result = await createAddress(formData);
      
      if (result.success) {
        setIsAddDialogOpen(false);
        resetForm();
        setError('');
        loadAddresses();
      } else {
        setError(result.error || 'Failed to create address');
      }
    } catch (error) {
      setError('An error occurred while creating address');
    } finally {
      setAddressSaving(false);
    }
  };

  const handleUpdateAddress = async () => {
    if (!editingAddress?.id) return;
    
    try {
      const result = await updateAddress(editingAddress.id, formData);
      
      if (result.success) {
        setEditingAddress(null);
        resetForm();
        setError('');
        loadAddresses();
      } else {
        setError(result.error || 'Failed to update address');
      }
    } catch (error) {
      setError('An error occurred while updating address');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      const result = await deleteAddress(addressId);
      
      if (result.success) {
        loadAddresses();
      } else {
        setError(result.error || 'Failed to delete address');
      }
    } catch (error) {
      setError('An error occurred while deleting address');
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const result = await setDefaultAddress(addressId);
      
      if (result.success) {
        loadAddresses();
      } else {
        setError(result.error || 'Failed to set default address');
      }
    } catch (error) {
      setError('An error occurred while setting default address');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'USA',
      phone: '',
      isDefault: false,
    });
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      firstName: address.address.firstName,
      lastName: address.address.lastName,
      addressLine1: address.address.addressLine1,
      addressLine2: address.address.addressLine2 || '',
      city: address.address.city,
      state: address.address.state,
      postalCode: address.address.postalCode,
      country: address.address.country,
      phone: address.address.phone,
      isDefault: address.address.isDefault || false,
    });
  };

  const getOrderStatusIndex = (status: string) => {
    if (CANCELLED_STATUSES.includes(status)) return -1;
    return ORDER_STATUS_STEPS.findIndex(step => step.key === status);
  };

  const OrderStatusBar = ({ status }: { status: string }) => {
    const isCancelled = CANCELLED_STATUSES.includes(status);
    const currentIndex = getOrderStatusIndex(status);

    if (isCancelled) {
      return (
        <div className="py-6">
          <div className="flex items-center justify-center">
            <div className="px-4 py-2 bg-red-50 border-2 border-red-500 rounded-none">
              <span className="text-xs font-bold uppercase tracking-widest text-red-700">
                {status}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="py-8">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
            <div 
              className="h-full bg-black transition-all duration-500"
              style={{ width: `${(currentIndex / (ORDER_STATUS_STEPS.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {ORDER_STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={step.key} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-black border-black'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {isCompleted && (
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`mt-3 text-[10px] font-bold uppercase tracking-widest text-center ${
                      isCompleted ? 'text-black' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container px-4 md:px-8 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-black font-serif uppercase tracking-tighter leading-none mb-2">My Account</h1>
          {user && (
            <p className="text-sm md:text-base font-medium tracking-widest text-gray-400 uppercase">
              Welcome back, {user.name || 'Member'}
            </p>
          )}
        </motion.div>

        <Tabs defaultValue="details" className="space-y-8">
          <TabsList className="inline-flex gap-8 bg-transparent p-0 w-full justify-start">
            <TabsTrigger 
              value="details" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-black text-gray-400 text-lg md:text-xl font-bold uppercase tracking-wider hover:text-gray-600 transition-colors px-0 pb-4 font-serif data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-black text-gray-400 text-lg md:text-xl font-bold uppercase tracking-wider hover:text-gray-600 transition-colors px-0 pb-4 font-serif data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="addresses" 
              className="data-[state=active]:bg-transparent data-[state=active]:text-black text-gray-400 text-lg md:text-xl font-bold uppercase tracking-wider hover:text-gray-600 transition-colors px-0 pb-4 font-serif data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
            >
              Addresses
            </TabsTrigger>
          </TabsList>

          <div className="pt-4">
            <TabsContent value="details" className="mt-0">
              <div className="max-w-4xl">
                <div className="flex flex-col md:flex-row gap-8 items-start p-8 bg-gray-50">
                  <div className="relative h-32 w-32 shrink-0 bg-white overflow-hidden rounded-full border-4 border-white shadow-lg">
                    {user?.avatar ? (
                      <Image src={user.avatar} alt="Profile" fill className="object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-black text-white">
                        <span className="text-4xl font-black font-serif uppercase">{user?.name?.charAt(0) || 'M'}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-3xl font-black font-serif uppercase tracking-tight mb-1">{user?.name || 'Guest Member'}</h3>
                      <p className="text-gray-500 tracking-wide text-sm">{user?.email}</p>
                    </div>
                    <Button 
                      onClick={() => setIsEditProfileOpen(true)} 
                      variant="outline" 
                      className="rounded-none border-2 border-black hover:bg-black hover:text-white uppercase tracking-widest text-xs font-bold h-11 px-8 transition-all"
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 p-8 border border-gray-200">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-2">Full Name</label>
                    <p className="text-lg font-medium text-gray-900">{user?.name || '-'}</p>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-2">Email Address</label>
                    <p className="text-lg font-medium text-gray-900">{user?.email}</p>
                  </div>
                  {user?.role && (
                    <div>
                      <label className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-2">Membership Status</label>
                      <p className="text-lg font-medium uppercase text-gray-900">{user.role}</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-0">
              {ordersLoading ? (
                <div className="py-20 flex justify-center">
                  <Loader2 className="animate-spin text-gray-300 h-8 w-8" />
                </div>
              ) : orders.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-gray-200">
                  <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-serif italic text-gray-400 mb-6">You haven't placed any orders yet.</p>
                  <Button asChild className="rounded-none bg-black text-white hover:bg-gray-800 uppercase tracking-widest text-xs font-bold px-8 h-12">
                    <Link href="/products">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border-2 border-gray-200 hover:border-black transition-all duration-300 bg-white">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-sm font-bold uppercase tracking-widest">Order #{order.orderNumber}</span>
                              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                                order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 
                                CANCELLED_STATUSES.includes(order.status) ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-serif font-bold">₹{Number(order.total).toFixed(2)}</span>
                            <Button 
                              onClick={() => setSelectedOrder(order)}
                              variant="outline"
                              className="rounded-none border-2 border-black hover:bg-black hover:text-white uppercase tracking-widest text-xs font-bold h-10 px-6"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100 space-y-2">
                          {order.items?.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 font-medium">{item.quantity}x {item.title || 'Product'}</span>
                              <span className="text-gray-900 font-semibold">₹{Number(item.price).toFixed(2)}</span>
                            </div>
                          ))}
                          {order.items && order.items.length > 2 && (
                            <p className="text-xs text-gray-400 italic">+{order.items.length - 2} more items</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="addresses" className="mt-0">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-serif font-bold">Saved Addresses</h3>
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)} 
                    className="rounded-none bg-black hover:bg-gray-800 text-white uppercase tracking-widest text-xs font-bold h-11 px-6"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                </div>

                {addresses.length === 0 && !loading ? (
                  <div className="py-20 text-center border-2 border-dashed border-gray-200">
                    <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-400 italic font-serif">No addresses saved yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="relative p-6 border-2 border-gray-200 hover:border-black transition-all group bg-white">
                        {addr.address.isDefault && (
                          <span className="absolute top-0 right-0 text-xs uppercase tracking-widest font-bold bg-black text-white px-3 py-1">Default</span>
                        )}
                        <h4 className="font-bold uppercase tracking-wide text-sm mb-3">{addr.address.firstName} {addr.address.lastName}</h4>
                        <div className="space-y-1 text-sm text-gray-600 mb-4">
                          <p>{addr.address.addressLine1}</p>
                          {addr.address.addressLine2 && <p>{addr.address.addressLine2}</p>}
                          <p>{addr.address.city}, {addr.address.state} {addr.address.postalCode}</p>
                          <p>{addr.address.country}</p>
                          <p className="pt-2 text-xs uppercase tracking-widest font-semibold text-gray-900">{addr.address.phone}</p>
                        </div>
                        <div className="flex gap-4 pt-4 border-t border-gray-100">
                          <button onClick={() => openEditDialog(addr)} className="text-xs font-bold uppercase tracking-widest hover:underline">Edit</button>
                          <button onClick={() => handleDeleteAddress(addr.id)} className="text-xs font-bold uppercase tracking-widest hover:underline text-red-600">Delete</button>
                          {!addr.address.isDefault && (
                            <button onClick={() => handleSetDefault(addr.id)} className="text-xs font-bold uppercase tracking-widest hover:underline text-gray-500 hover:text-black">Set Default</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-2xl p-0 border-0 shadow-2xl rounded-none bg-white max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader className="p-8 pb-0">
                <DialogTitle className="text-3xl font-black font-serif uppercase tracking-tight mb-2">Order Details</DialogTitle>
                <p className="text-sm text-gray-500 uppercase tracking-widest">Order #{selectedOrder.orderNumber}</p>
              </DialogHeader>
              
              <div className="px-8">
                <OrderStatusBar status={selectedOrder.status} />
              </div>

              <div className="px-8 py-6 bg-gray-50 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-1">Order Date</span>
                    <span className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-1">Payment Method</span>
                    <span className="font-medium uppercase">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-1">Payment Status</span>
                    <span className={`font-medium uppercase ${selectedOrder.paymentStatus === 'PAID' ? 'text-green-600' : 'text-gray-600'}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-bold block mb-1">Store</span>
                    <span className="font-medium">{selectedOrder.storeName}</span>
                  </div>
                </div>
              </div>

              <div className="p-8 pt-6">
                <h4 className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-700">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start p-4 bg-gray-50 border border-gray-200">
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-1">{item.title || 'Product'}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Quantity: {item.quantity}</p>
                      </div>
                      <span className="text-lg font-serif font-bold">₹{Number(item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t-2 border-gray-200 flex justify-between items-center">
                  <span className="text-lg font-bold uppercase tracking-wide">Total</span>
                  <span className="text-3xl font-serif font-black">₹{Number(selectedOrder.total).toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-md p-8 border-0 shadow-2xl rounded-none bg-white">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black font-serif uppercase tracking-tight">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Profile Picture</Label>
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24 shrink-0 bg-gray-100 overflow-hidden rounded-full border-2 border-gray-200">
                  {avatarPreview ? (
                    <Image src={avatarPreview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-black text-white">
                      <span className="text-3xl font-black font-serif uppercase">{profileForm.name?.charAt(0) || 'M'}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <Label
                    htmlFor="avatar-upload"
                    className="inline-flex items-center justify-center h-11 px-6 rounded-none border-2 border-black hover:bg-black hover:text-white uppercase tracking-widest text-xs font-bold cursor-pointer transition-all"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Label>
                  <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF (max. 5MB)</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profileName" className="text-xs uppercase tracking-widest text-gray-500 font-bold">Full Name</Label>
              <Input
                id="profileName"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="border-2 border-gray-200 focus:border-black rounded-none h-12"
                placeholder="Enter your name"
              />
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button 
              onClick={handleUpdateProfile} 
              disabled={profileSaving} 
              className="w-full h-12 rounded-none bg-black hover:bg-gray-800 text-white uppercase tracking-widest text-xs font-bold"
            >
              {profileSaving ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        
      {/* Address Dialog (Shared for Add/Edit) */}
      <Dialog open={isAddDialogOpen || !!editingAddress} onOpenChange={(open) => { if(!open) { setIsAddDialogOpen(false); setEditingAddress(null); resetForm(); } }}>
        <DialogContent className="sm:max-w-xl p-8 border-0 shadow-2xl rounded-none bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-black font-serif uppercase tracking-tight">
              {editingAddress ? 'Edit Address' : 'New Address'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-gray-500 font-bold">First Name</Label>
                <Input 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                  className="rounded-none border-2 border-gray-200 h-11 focus:border-black" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Last Name</Label>
                <Input 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                  className="rounded-none border-2 border-gray-200 h-11 focus:border-black" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Address Line 1</Label>
              <Input 
                value={formData.addressLine1} 
                onChange={(e) => setFormData({...formData, addressLine1: e.target.value})} 
                className="rounded-none border-2 border-gray-200 h-11 focus:border-black" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Address Line 2 (Optional)</Label>
              <Input 
                value={formData.addressLine2} 
                onChange={(e) => setFormData({...formData, addressLine2: e.target.value})} 
                className="rounded-none border-2 border-gray-200 h-11 focus:border-black" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-gray-500 font-bold">City</Label>
                <Input 
                  value={formData.city} 
                  onChange={(e) => setFormData({...formData, city: e.target.value})} 
                  className="rounded-none border-2 border-gray-200 h-11 focus:border-black" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-gray-500 font-bold">State</Label>
                <Input 
                  value={formData.state} 
                  onChange={(e) => setFormData({...formData, state: e.target.value})} 
                  className="rounded-none border-2 border-gray-200 h-11 focus:border-black" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Postal Code</Label>
                <Input 
                  value={formData.postalCode} 
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})} 
                  className="rounded-none border-2 border-gray-200 h-11 focus:border-black" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Country</Label>
                <Input 
                  value={formData.country} 
                  onChange={(e) => setFormData({...formData, country: e.target.value})} 
                  className="rounded-none border-2 border-gray-200 h-11 focus:border-black" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Phone</Label>
              <Input 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                className="rounded-none border-2 border-gray-200 h-11 focus:border-black" 
              />
            </div>
          </div>
          
          <DialogFooter className="mt-8 pt-6 border-t-2 border-gray-100">
            <div className="flex gap-4 w-full">
              <Button 
                variant="outline" 
                onClick={() => { setIsAddDialogOpen(false); setEditingAddress(null); resetForm(); }} 
                className="flex-1 rounded-none border-2 border-gray-300 hover:border-black uppercase tracking-widest text-xs font-bold h-12"
              >
                Cancel
              </Button>
              <Button 
                onClick={editingAddress ? handleUpdateAddress : handleCreateAddress} 
                disabled={addressSaving} 
                className="flex-1 rounded-none bg-black hover:bg-gray-800 text-white uppercase tracking-widest text-xs font-bold h-12"
              >
                {addressSaving ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Saving...
                  </>
                ) : (
                  editingAddress ? 'Update Address' : 'Save Address'
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}