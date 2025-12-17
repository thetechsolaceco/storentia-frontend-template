"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Upload,
  Link as LinkIcon,
  X,
  Package,
  Minus,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { collectionsAPI, type Collection } from "@/lib/apiClients";
import { Checkbox } from "@/components/ui/checkbox";
import { PageLoader } from "@/components/admin/page-loader";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type SortConfig = {
  key: keyof Collection | "productCount";
  direction: "asc" | "desc";
} | null;

export default function CategoriesPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");

  // Image Upload States
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Product Management States
  const [manageProductsOpen, setManageProductsOpen] = useState(false);
  const [collectionProducts, setCollectionProducts] = useState<any[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [addingProducts, setAddingProducts] = useState(false);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchCollections = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await collectionsAPI.getAll({
        page,
        limit: 20,
        search: searchTerm || undefined,
      });

      if (response.success && response.data) {
        setCollections(response.data);
        setPagination(response.pagination || null);
      } else {
        setError(response.message || "Failed to fetch categories");
        setCollections([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch categories";
      if (errorMessage.includes("Store ID not found")) {
        setError("Please go to Dashboard first to initialize your store.");
      } else {
        setError(errorMessage);
      }
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [page]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Effect to trigger search when term changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchCollections();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleCreate = async () => {
    if (!formTitle.trim()) return;
    setFormLoading(true);
    try {
      const response = await collectionsAPI.create({
        title: formTitle.trim(),
        description: formDescription.trim() || undefined,
      });
      if (response.success) {
        setCreateOpen(false);
        setFormTitle("");
        setFormDescription("");
        fetchCollections();
      } else {
        alert(response.message || "Failed to create category");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedCollection || !formTitle.trim()) return;
    setFormLoading(true);
    try {
      const response = await collectionsAPI.update(selectedCollection.id, {
        title: formTitle.trim(),
        description: formDescription.trim() || undefined,
      });
      if (response.success) {
        setEditOpen(false);
        setSelectedCollection(null);
        setFormTitle("");
        setFormDescription("");
        fetchCollections();
      } else {
        alert(response.message || "Failed to update category");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update category");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCollection) return;
    setFormLoading(true);
    try {
      const response = await collectionsAPI.delete(selectedCollection.id);
      if (response.success) {
        setDeleteOpen(false);
        setSelectedCollection(null);
        fetchCollections();
      } else {
        alert(response.message || "Failed to delete category");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete category");
    } finally {
      setFormLoading(false);
    }
  };

  const openEditDialog = (collection: Collection) => {
    setSelectedCollection(collection);
    setFormTitle(collection.title);
    setFormDescription(collection.description || "");
    setEditOpen(true);
  };

  const openDeleteDialog = (collection: Collection) => {
    setSelectedCollection(collection);
    setDeleteOpen(true);
  };

  const openManageProducts = async (collection: Collection) => {
    setSelectedCollection(collection);
    setManageProductsOpen(true);
    setLoading(true); // Re-use loading or specific loading state
    try {
      const res = await collectionsAPI.getProducts(collection.id, {
        limit: 100,
      });
      if (res.success && res.data) {
        // API response wraps product in a relation object "product"
        setCollectionProducts(
          res.data.map((item: any) => item.product || item)
        );
      }
    } catch (err) {
      console.error("Failed to load collection products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCollection || !e.target.files?.length) return;
    setUploadingImage(true);
    try {
      const files = Array.from(e.target.files);
      const response = await collectionsAPI.uploadImage(
        selectedCollection.id,
        files
      );
      if (response.success) {
        fetchCollections(); // Refresh list to see new image if applicable or just update local
        // Optionally update selectedCollection if needed for preview
      } else {
        alert(response.message || "Failed to upload image");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    if (!selectedCollection) return;
    try {
      const response = await collectionsAPI.deleteImage(selectedCollection.id);
      if (response.success) {
        fetchCollections();
      } else {
        alert(response.message || "Failed to delete image");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete image");
    }
  };

  // ... edit and delete are fine

  const handleSort = (key: keyof Collection | "productCount") => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCollections = [...collections].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;

    let aValue: any = a[key as keyof Collection];
    let bValue: any = b[key as keyof Collection];

    if (key === "productCount") {
      aValue = a.products?.length || 0;
      bValue = b.products?.length || 0;
    }

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(collections.map((c) => c.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedIds(newSet);
  };

  const isAllSelected =
    collections.length > 0 && selectedIds.size === collections.length;
  const isSomeSelected =
    selectedIds.size > 0 && selectedIds.size < collections.length;

  return (
    <div className="space-y-4 font-sans h-full flex flex-col">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-playfair font-medium tracking-tight text-foreground">
          Categories
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 mt-1 text-sm font-inter">
          Manage and organize your product types.
        </p>
      </div>

      {/* Table Filters & buttons */}
      <div className="py-3 flex items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-transparent pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground text-foreground border-b-2 border-border focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Add Button */}
        <Button
          onClick={() => setCreateOpen(true)}
          size="sm"
          className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Create Category
        </Button>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <PageLoader />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-3 text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchCollections()}
            >
              Try Again
            </Button>
          </div>
        ) : collections.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <p className="text-muted-foreground text-sm">
              No categories found matching your search.
            </p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="w-12 px-4 py-4">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        className="data-[state=checked]:bg-black dark:data-[state=checked]:bg-white data-[state=checked]:border-black dark:data-[state=checked]:border-white"
                        {...(isSomeSelected
                          ? { "data-state": "indeterminate" }
                          : {})}
                      />
                    </th>
                    <th
                      className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-4 cursor-pointer hover:bg-accent transition-colors select-none"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center gap-1.5">
                        Name
                        {sortConfig?.key === "title" ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                        )}
                      </div>
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-4">
                      Description
                    </th>
                    <th
                      className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-4 cursor-pointer hover:bg-accent transition-colors select-none"
                      onClick={() => handleSort("productCount")}
                    >
                      <div className="flex items-center gap-1.5">
                        Products
                        {sortConfig?.key === "productCount" ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </th>
                    <th
                      className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-4 cursor-pointer hover:bg-accent transition-colors select-none"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-1.5">
                        Created
                        {sortConfig?.key === "createdAt" ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sortedCollections.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <Checkbox
                          checked={selectedIds.has(c.id)}
                          onCheckedChange={(checked) =>
                            handleSelectOne(c.id, checked as boolean)
                          }
                          className="data-[state=checked]:bg-black dark:data-[state=checked]:bg-white data-[state=checked]:border-black dark:data-[state=checked]:border-white"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium text-foreground text-sm">
                          {c.title}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="text-muted-foreground text-sm truncate max-w-[200px] block"
                          title={c.description}
                        >
                          {c.description || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                          {c.products?.length || 0}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-muted-foreground text-sm">
                          {c.createdAt
                            ? new Date(c.createdAt).toLocaleDateString()
                            : "-"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                            onClick={() => openManageProducts(c)}
                            title="Manage Products"
                          >
                            <Package className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                            onClick={() => openEditDialog(c)}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                            onClick={() => openDeleteDialog(c)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Pagination - Simplified and moved near controls if needed, or kept separate */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-2">
          {/* ... (Kept simple or removed if minimal design prefers just load more/scroll) */}
          {/* Keeping basic pagination for now but hidden if not needed or could be part of footer */}
        </div>
      )}

      {/* Create Dialog - Cleaned up */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl">
              New Category
            </DialogTitle>
            <DialogDescription>
              Create a new category to organize your products.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Summer Collection"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="border-gray-200 focus:ring-0 focus:border-black rounded-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe this category..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="border-gray-200 focus:ring-0 focus:border-black rounded-sm resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setCreateOpen(false)}
              disabled={formLoading}
              className="hover:bg-gray-100 rounded-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={formLoading || !formTitle.trim()}
              className="bg-black text-white hover:bg-gray-900 rounded-sm"
            >
              {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - Enhanced with Image Upload */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl">
              Edit Category
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex items-start gap-6">
              {/* Image Section */}
              <div className="w-32 flex-shrink-0">
                <Label className="mb-2 block">Cover Image</Label>
                <div className="relative aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center bg-muted/20 overflow-hidden group">
                  {selectedCollection?.image || selectedCollection?.imageId ? (
                    // Using image ID or URL placeholder logic
                    <div className="w-full h-full relative">
                      <img
                        src={
                          selectedCollection.image || "https://placehold.co/150"
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-2">
                      <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                      <span className="text-[10px] text-muted-foreground">
                        Upload
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              {/* Fields */}
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="rounded-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="rounded-sm resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setEditOpen(false)}
              disabled={formLoading}
              className="rounded-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={formLoading || !formTitle.trim()}
              className="bg-primary text-primary-foreground rounded-sm"
            >
              {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Products Dialog */}
      <Dialog open={manageProductsOpen} onOpenChange={setManageProductsOpen}>
        <DialogContent className="sm:max-w-2xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Manage Products in {selectedCollection?.title}
            </DialogTitle>
            <DialogDescription>
              Add or remove products from this category.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4">
            {loading ? (
              <PageLoader />
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-muted/30 p-2 rounded-md">
                  <h4 className="text-sm font-medium">
                    Products ({collectionProducts.length})
                  </h4>
                  {/* Add search or add button logic here if needed */}
                </div>

                {collectionProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No products in this category.
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {collectionProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                            {p.images?.[0]?.url ? (
                              <img
                                src={p.images[0].url}
                                className="h-full w-full object-cover rounded"
                                alt=""
                              />
                            ) : (
                              <Package className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{p.title}</p>
                            <p className="text-xs text-muted-foreground">
                              ${p.price}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={async () => {
                            if (!selectedCollection) return;
                            if (!confirm("Remove this product?")) return;
                            try {
                              await collectionsAPI.removeProduct(
                                selectedCollection.id,
                                p.id
                              );
                              // Refresh list
                              const res = await collectionsAPI.getProducts(
                                selectedCollection.id,
                                { limit: 100 }
                              );
                              if (res.success)
                                setCollectionProducts(
                                  res.data.map(
                                    (item: any) => item.product || item
                                  )
                                );
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-playfair">
              Delete Category?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-black">
                &quot;{selectedCollection?.title}&quot;
              </span>
              .
              <br />
              Products in this category will not be deleted but will be
              uncategorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={formLoading} className="rounded-sm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={formLoading}
              className="bg-red-600 hover:bg-red-700 text-white rounded-sm"
            >
              {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
