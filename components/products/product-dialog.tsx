"use client"

import { AlertCircle, Loader } from "lucide-react"
import { useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Product } from "@/lib/mock-products"

interface ProductDialogProps {
  isOpen: boolean
  onClose: () => void
  product?: Product
  onSave: (product: Product) => void
  isLoading?: boolean
}

interface DeleteConfirmProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onConfirm: () => void
  isLoading?: boolean
  isMultiple?: boolean
  count?: number
}

const CATEGORIES = ["Áo", "Quần", "Giày", "Túi", "Phụ Kiện"]
const STATUSES = ["active", "inactive", "discontinued"]

export function ProductDialog({
  isOpen,
  onClose,
  product,
  onSave,
  isLoading = false,
}: ProductDialogProps) {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      id: Math.random().toString(),
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

  const handleSave = () => {
    if (!formData.name || !formData.sku || !formData.category) {
      alert("Vui lòng điền đầy đủ thông tin")
      return
    }
    onSave(formData as Product)
    setFormData({
      id: Math.random().toString(),
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
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Cập nhật thông tin sản phẩm"
              : "Nhập thông tin sản phẩm mới"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên sản phẩm</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku || ""}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                placeholder="Nhập SKU"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Danh mục</Label>
              <Select
                value={formData.category || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="category" className="min-w-[120px]">
                  <SelectValue placeholder="Chọn danh mục" />
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Giá (VND)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || 0}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Tồn kho</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock || 0}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status || "active"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as "active" | "inactive" | "discontinued",
                  })
                }
              >
                <SelectTrigger id="status" className="min-w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                  <SelectItem value="discontinued">Ngừng KD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end pb-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isHot"
                  checked={formData.isHot || false}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isHot: checked as boolean })
                  }
                />
                <Label htmlFor="isHot" className="cursor-pointer">
                  Sản phẩm nổi bật 🔥
                </Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  product,
  onConfirm,
  isLoading = false,
  isMultiple = false,
  count = 0,
}: DeleteConfirmProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            {isMultiple ? `Xóa ${count} sản phẩm?` : "Xóa sản phẩm này?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isMultiple
              ? `Bạn sắp xóa ${count} sản phẩm được chọn. Hành động này không thể hoàn tác.`
              : `Bạn sắp xóa sản phẩm "${product?.name}". Hành động này không thể hoàn tác.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              "Xóa"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
