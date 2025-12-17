"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  ChevronRight,
  Loader2,
  ArrowLeft,
  Upload,
  X,
  Search,
  Image as ImageIcon,
  FileText,
  BoxSelect,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import {
  productsAPI,
  collectionsAPI,
  type ProductStatus,
  type Collection,
} from "@/lib/apiClients";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SortConfig = {
  key: keyof Collection | "productCount";
  direction: "asc" | "desc";
} | null;

const STEPS = [
  {
    id: 1,
    name: "Product Details",
    description: "Basic info, status, and inventory",
    icon: FileText,
  },
  {
    id: 2,
    name: "Upload Images",
    description: "Add product gallery images",
    icon: ImageIcon,
  },
  {
    id: 3,
    name: "Select Category",
    description: "Choose a category for your product",
    icon: BoxSelect,
  },
];

export default function NewProductPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    sku: "",
    status: "ACTIVE" as ProductStatus,
    stock: "",
  });

  // Image Helper State
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category Helper State
  const [categories, setCategories] = useState<Collection[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [categorySearch, setCategorySearch] = useState("");
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  useEffect(() => {
    // Clean up previews on unmount
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  useEffect(() => {
    if (currentStep === 3) {
      fetchCategories();
    }
  }, [currentStep]);

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

  const sortedCategories = [...categories].sort((a, b) => {
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

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await collectionsAPI.getAll({
        limit: 100,
        search: categorySearch,
      });
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Debounced search effect could be added, but for now simple trigger
  useEffect(() => {
    if (currentStep === 3) {
      const timer = setTimeout(() => {
        fetchCategories();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [categorySearch]);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create Product
      const payload = {
        title: formData.title,
        description: formData.description,
        price: formData.price ? parseFloat(formData.price) : 0,
        sku: formData.sku,
        status: formData.status,
        stock: formData.stock ? parseInt(formData.stock) : 0,
        category: selectedCategoryId || undefined, // Send category ID if selected
      };

      const response = await productsAPI.create(payload);

      if (response.success && response.data) {
        const newProductId = response.data.id;

        // 2. Upload Images if any
        if (files.length > 0) {
          await productsAPI.uploadMultipleImages(newProductId, files);
        }

        // Redirect
        router.push(`/storentia/dashboard/products/${newProductId}`);
      } else {
        setError(response.message || "Failed to create product");
        setLoading(false);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 font-sans h-full flex flex-col pb-10">
      {/* Global Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/storentia/dashboard/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-playfair font-medium tracking-tight text-foreground">
            New Product
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 mt-1 text-sm font-inter">
            Add a new product to your catalog.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 pt-6">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Step Title Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-semibold tracking-tight text-foreground mb-2">
              Step {currentStep}: {STEPS[currentStep - 1].name}
            </h2>
            <p className="text-lg text-muted-foreground">
              {STEPS[currentStep - 1].description}
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-md mb-8">
              {error}
            </div>
          )}

          {/* Form Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[400px]">
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Product Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. Classic Cotton T-Shirt"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product..."
                    rows={6}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="resize-none"
                  />
                </div>

                {/* Grid for Price, Stock, SKU, Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price */}
                  <div className="space-y-3">
                    <Label htmlFor="price" className="text-sm font-medium">
                      Price
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">
                        $
                      </span>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="space-y-3">
                    <Label htmlFor="stock" className="text-sm font-medium">
                      Stock Quantity
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                    />
                  </div>

                  {/* SKU */}
                  <div className="space-y-3">
                    <Label htmlFor="sku" className="text-sm font-medium">
                      SKU (Optional)
                    </Label>
                    <Input
                      id="sku"
                      placeholder="stock-keeping-unit"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-3">
                    <Label htmlFor="status" className="text-sm font-medium">
                      Product Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(val) =>
                        setFormData({
                          ...formData,
                          status: val as ProductStatus,
                        })
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="UNLISTED">Unlisted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div
                  className="border-2 border-dashed border-input rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Click to upload images
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Upload high quality images for your product. You can upload
                    multiple images at once.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>

                {files.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {previews.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border group"
                      >
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <div
                      className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Category Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search categories..."
                    className="pl-10 h-11 text-base w-full md:w-1/2"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                  />
                </div>

                {/* Categories Table */}
                <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/30 border-b border-border">
                        <tr>
                          <th className="w-12 px-4 py-3"></th>
                          <th
                            className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 cursor-pointer hover:bg-accent transition-colors select-none"
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
                                <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                              )}
                            </div>
                          </th>
                          <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                            Description
                          </th>
                          <th
                            className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 cursor-pointer hover:bg-accent transition-colors select-none"
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
                                <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                              )}
                            </div>
                          </th>
                          <th
                            className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 cursor-pointer hover:bg-accent transition-colors select-none"
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
                                <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                              )}
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {categoriesLoading ? (
                          <tr>
                            <td colSpan={5} className="p-12 text-center">
                              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                            </td>
                          </tr>
                        ) : sortedCategories.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="p-12 text-center text-muted-foreground"
                            >
                              No categories found.
                            </td>
                          </tr>
                        ) : (
                          sortedCategories.map((category) => {
                            const isSelected =
                              selectedCategoryId === category.id;
                            return (
                              <tr
                                key={category.id}
                                onClick={() =>
                                  setSelectedCategoryId(category.id)
                                }
                                className={cn(
                                  "cursor-pointer transition-colors",
                                  isSelected
                                    ? "bg-primary/5 hover:bg-primary/10"
                                    : "hover:bg-muted/50"
                                )}
                              >
                                <td className="px-4 py-3">
                                  <div
                                    className={cn(
                                      "h-5 w-5 rounded-full border flex items-center justify-center transition-all",
                                      isSelected
                                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                        : "border-muted-foreground/30 bg-background"
                                    )}
                                  >
                                    {isSelected && (
                                      <div className="h-2 w-2 rounded-full bg-current" />
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden border border-border/50">
                                      {category.image || category.imageId ? (
                                        <img
                                          src={category.image || ""}
                                          className="w-full h-full object-cover"
                                          alt=""
                                        />
                                      ) : (
                                        <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                                      )}
                                    </div>
                                    <span className="font-medium text-sm text-foreground">
                                      {category.title}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className="text-muted-foreground text-sm truncate max-w-[200px] block opacity-80"
                                    title={category.description || ""}
                                  >
                                    {category.description || "No description"}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                    {category.products?.length || 0}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-muted-foreground text-sm">
                                    {category.createdAt
                                      ? new Date(
                                          category.createdAt
                                        ).toLocaleDateString()
                                      : "-"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <p className="text-sm text-muted-foreground">
                    Don't see the category you need?{" "}
                    <Link
                      href="/storentia/dashboard/categories"
                      target="_blank"
                      className="text-primary hover:underline"
                    >
                      Create a new one
                    </Link>{" "}
                    (opens in new tab)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-auto pt-8">
            {currentStep > 1 && (
              <Button
                variant="ghost"
                size="lg"
                onClick={handleBack}
                disabled={loading}
                className="px-8"
              >
                Back
              </Button>
            )}

            {currentStep < STEPS.length ? (
              <Button
                size="lg"
                onClick={handleNext}
                disabled={loading}
                className="px-8 ml-auto"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 ml-auto"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Product
              </Button>
            )}
          </div>
        </div>

        {/* Right Sidebar - Steps */}
        <div className="w-62 shrink-0 hidden lg:block">
          <div className="sticky top-8">
            <div className="relative pl-6 border-l border-border/40 space-y-10">
              {STEPS.map((step, index) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "relative transition-all duration-300",
                      isCompleted || isCurrent ? "opacity-100" : "opacity-40"
                    )}
                  >
                    {/* Icon indicator on the line */}
                    <div
                      className={cn(
                        "absolute -left-[41px] top-0 h-9 w-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 bg-background",
                        isCurrent
                          ? "border-primary text-primary shadow-[0_0_0_4px_rgba(var(--primary),0.1)]"
                          : isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 text-muted-foreground"
                      )}
                    >
                      <step.icon className="h-4 w-4" />
                    </div>

                    <div className="h-9 flex items-center pl-2">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          isCurrent
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {step.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Info Box - Translucent */}
            <div className="mt-12 p-6 bg-muted/20 backdrop-blur-sm rounded-2xl border border-border/50">
              <h4 className="font-semibold text-sm mb-2">Need Help?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Need assistance with product creation or inventory?
              </p>
              <Link
                href="https://storentia.com/contact"
                className="text-sm font-medium text-primary hover:underline"
              >
                Contact Support &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
