"use client"

import { AlertCircle, ArrowLeft, Save, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { ProductCarousel } from "@/components/products/product-carousel"
import { DeleteConfirmDialog } from "@/components/products/product-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { mockProducts, Product } from "@/lib/mock-products"

const CATEGORIES = ["Áo", "Quần", "Giày", "Túi", "Phụ Kiện"]
const STATUSES = ["active", "inactive", "discontinued"]

interface PageProps {
  params: {
    slug: string
  }
}

export default function ProductDetailPage({ params }: PageProps) {
  const router = useRouter()
  const product = mockProducts.find((p) => p.slug === params.slug)

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState<Product>(
    product || {
      id: "",
      slug: "",
      name: "",
      sku: "",
      category: "",
      price: 0,
      stock: 0,
      status: "active",
      isHot: false,
      description: "",
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  )

  if (!product) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>

        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Sản phẩm không tìm thấy</h2>
          <p className="text-sm text-muted-foreground">
            Sản phẩm bạn tìm kiếm không còn tồn tại
          </p>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      console.log("Saving product:", formData)
      setIsEditing(false)
      setIsSaving(false)
    }, 500)
  }

  const handleDelete = () => {
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      console.log("Deleting product:", formData.id)
      router.push("/products")
    }, 500)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "discontinued":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <div className="mt-4 flex gap-2 sm:mt-0">
            {!isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Chỉnh sửa
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setFormData(product)
                  }}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving ? (
                    "Đang lưu..."
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side - Images */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border p-4">
            <ProductCarousel images={product.images} alt={product.name} />
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <div className="space-y-4 rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>

            {!isEditing ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Tên sản phẩm</p>
                  <p className="font-medium">{formData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SKU</p>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                    {formData.sku}
                  </code>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Danh mục</p>
                    <p className="font-medium">{formData.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Giá</p>
                    <p className="text-lg font-medium text-primary">
                      {formatCurrency(formData.price)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mô tả</p>
                  <p className="text-sm leading-relaxed">
                    {formData.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Tên sản phẩm</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Danh mục</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger id="category" className="min-w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="price">Giá (VND)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Stock & Status */}
          <div className="space-y-4 rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Tồn kho & Trạng thái</h2>

            {!isEditing ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Tồn kho</p>
                  <p className="text-lg font-medium">
                    {formData.stock} {formData.stock === 0 && "📦"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                  <Badge className={getStatusColor(formData.status)}>
                    {formData.status === "active"
                      ? "Hoạt động"
                      : formData.status === "inactive"
                        ? "Không hoạt động"
                        : "Ngừng KD"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Sản phẩm nổi bật
                  </p>
                  <p className="font-medium">
                    {formData.isHot ? "✓ Có" : "✗ Không"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="stock">Tồn kho</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        status: value as "active" | "inactive" | "discontinued",
                      })
                    }
                  >
                    <SelectTrigger id="status" className="min-w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                      <SelectItem value="discontinued">Ngừng KD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isHot"
                    checked={formData.isHot}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isHot: checked as boolean })
                    }
                  />
                  <Label htmlFor="isHot" className="cursor-pointer">
                    Sản phẩm nổi bật 🔥
                  </Label>
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="space-y-3 rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Thông tin hệ thống</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID sản phẩm:</span>
                <code className="rounded bg-muted px-2 py-1 font-mono">
                  {formData.id}
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slug:</span>
                <code className="rounded bg-muted px-2 py-1 font-mono">
                  {formData.slug}
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày tạo:</span>
                <span>{formatDate(formData.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Cập nhật lần cuối:
                </span>
                <span>{formatDate(formData.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        product={product}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
