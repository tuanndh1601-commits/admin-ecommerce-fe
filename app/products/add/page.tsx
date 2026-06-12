"use client"

import { Loader2, Save, Trash2, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

// 1. ĐỊNH NGHĨA SCHEMA VALIDATE BẰNG ZOD (Chuẩn hóa dữ liệu đầu vào)
const productFormSchema = z.object({
  name: z.string().min(5, { message: "Tên sản phẩm phải có ít nhất 5 ký tự." }),
  description: z.string().optional(),
  price: z.coerce
    .number()
    .min(1000, { message: "Giá bán thấp nhất là 1,000đ." }),
  comparePrice: z.coerce.number().optional(),
  sku: z.string().optional(),
  stock: z.coerce
    .number()
    .min(0, { message: "Số lượng kho không được âm." })
    .default(0),
  status: z.enum(["active", "draft", "archived"]).default("active"),
  isHot: z.boolean().default(false),
  category: z.string().min(1, { message: "Vui lòng chọn danh mục chính." }),
  brand: z.string().optional(),
  tags: z.string().optional(),
})

// Định nghĩa kiểu dữ liệu dựa trên Schema
type ProductFormValues = z.infer<typeof productFormSchema>

export default function AddProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State quản lý danh sách file hình ảnh để hiển thị Preview
  const [images, setImages] = useState<{ id: string; url: string }[]>([])

  // 2. KHỞI TẠO REACT HOOK FORM
  const form = useForm<ProductFormValues>({
    // Sử dụng resolver để kết nối dữ liệu form với Zod
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      comparePrice: 0,
      sku: "",
      stock: 0,
      status: "active",
      isHot: false,
      category: "",
      brand: "",
      tags: "",
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form

  // Theo dõi giá trị của select và switch để cập nhật giao diện (vì chúng không dùng thẻ input native)
  const currentStatus = watch("status")
  const currentIsHot = watch("isHot")
  const currentCategory = watch("category")

  // 3. XỬ LÝ LỰA CHỌN ẢNH (Bản thật - Client Preview)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)

      // Tạo URL tạm thời (blob) để hiển thị lên màn hình ngay lập tức
      const newImages = filesArray.map((file) => ({
        id: Math.random().toString(36).substr(2, 9), // ID ngẫu nhiên để làm key
        url: URL.createObjectURL(file),
      }))

      setImages((prev) => [...prev, ...newImages].slice(0, 5)) // Giới hạn tối đa 5 ảnh
    }
  }

  // Xóa ảnh đã chọn
  const handleRemoveImage = (id: string, url: string) => {
    setImages(images.filter((img) => img.id !== id))
    URL.revokeObjectURL(url) // Thu hồi bộ nhớ của blob URL
  }

  // 4. HÀM SUBMIT FORM GỬI LÊN BACKEND
  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true)
    try {
      // Giả lập gọi API (Thay thế đoạn này bằng hàm fetch/axios của bạn)
      console.log("Dữ liệu Form sản phẩm:", data)
      console.log("Danh sách ảnh gửi kèm:", images)

      await new Promise((resolve) => setTimeout(resolve, 1500)) // Chờ 1.5s

      // Thành công -> Điều hướng về lại trang danh sách sản phẩm
      router.push("/products")
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* FORM BAO QUAN TOÀN BỘ LAYOUT */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* HEADER BAR */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Thêm sản phẩm mới
            </h1>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push("/products")}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              className="gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Công bố sản phẩm
                </>
              )}
            </Button>
          </div>
        </div>

        {/* MAIN LAYOUT CHIA CỘT */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* CỘT TRÁI (CHIẾM 2/3): THÔNG TIN CHÍNH */}
          <div className="space-y-6 lg:col-span-2">
            {/* Card: Thông tin cơ bản */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Thông tin chung
                </CardTitle>
                <CardDescription>
                  Nhập các thông tin cơ bản hiển thị trên trang chi tiết sản
                  phẩm.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Tên sản phẩm <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ví dụ: Áo thun nam Cotton Compact Premium"
                    className={`h-10 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs font-medium text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả chi tiết</Label>
                  <Textarea
                    id="description"
                    placeholder="Viết mô tả sản phẩm của bạn tại đây..."
                    className="min-h-[150px] resize-none"
                    {...register("description")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Card: Hình ảnh sản phẩm (Upload thật) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Hình ảnh sản phẩm
                </CardTitle>
                <CardDescription>
                  Tải lên tối đa 5 hình ảnh. Ảnh đầu tiên sẽ tự động làm ảnh
                  bìa.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {/* Ô Kích Hoạt Tải File */}
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/20 bg-muted/30 transition-colors hover:bg-muted/50">
                    <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Tải ảnh lên
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>

                  {/* Vòng lặp hiển thị danh sách ảnh Preview */}
                  {images.map((img, index) => (
                    <div
                      key={img.id}
                      className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                    >
                      <img
                        src={img.url}
                        alt="Product preview"
                        className="h-full w-full object-cover"
                      />
                      {index === 0 && (
                        <span className="absolute top-2 left-2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm">
                          Ảnh bìa
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id, img.url)}
                        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-destructive opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-background"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Card: Giá cả & Kho hàng */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Giá cả & Kho hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Giá bán lẻ (đ) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      className={`h-10 ${errors.price ? "border-destructive" : ""}`}
                      {...register("price")}
                    />
                    {errors.price && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comparePrice">
                      Giá so sánh / Giá gốc (đ)
                    </Label>
                    <Input
                      id="comparePrice"
                      type="number"
                      className="h-10"
                      {...register("comparePrice")}
                    />
                  </div>
                </div>

                <hr className="border-muted/60" />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sku">Mã SKU</Label>
                    <Input
                      id="sku"
                      placeholder="Ví dụ: AT-NAM-01"
                      className="h-10"
                      {...register("sku")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Số lượng kho</Label>
                    <Input
                      id="stock"
                      type="number"
                      className={`h-10 ${errors.stock ? "border-destructive" : ""}`}
                      {...register("stock")}
                    />
                    {errors.stock && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.stock.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CỘT PHẢI (CHIẾM 1/3): PHÂN LOẠI & TRẠNG THÁI */}
          <div className="space-y-6">
            {/* Card: Trạng thái hiển thị */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Trạng thái sản phẩm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select
                    value={currentStatus}
                    onValueChange={(value) => setValue("status", value as any)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom">
                      <SelectItem value="active">Hoạt động (Active)</SelectItem>
                      <SelectItem value="draft">Bản nháp (Draft)</SelectItem>
                      <SelectItem value="archived">
                        Lưu trữ (Archived)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="isHot">Sản phẩm nổi bật</Label>
                    <p className="text-xs text-muted-foreground">
                      Đẩy lên phần gợi ý trang chủ.
                    </p>
                  </div>
                  <Switch
                    id="isHot"
                    checked={currentIsHot}
                    onCheckedChange={(checked) => setValue("isHot", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Card: Phân loại hàng hóa */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Phân loại
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Danh mục chính <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={currentCategory}
                    onValueChange={(value) => setValue("category", value)}
                  >
                    <SelectTrigger
                      className={`h-10 ${errors.category ? "border-destructive" : ""}`}
                    >
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom">
                      <SelectItem value="fashion">Thời trang nam</SelectItem>
                      <SelectItem value="electronics">
                        Điện tử - Công nghệ
                      </SelectItem>
                      <SelectItem value="home">Nhà cửa đời sống</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-xs font-medium text-destructive">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Thương hiệu</Label>
                  <Input
                    id="brand"
                    placeholder="Coolmate, Nike..."
                    className="h-10"
                    {...register("brand")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Thẻ (Tags)</Label>
                  <Input
                    id="tags"
                    placeholder="áo thun, cotton, mới"
                    className="h-10"
                    {...register("tags")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
