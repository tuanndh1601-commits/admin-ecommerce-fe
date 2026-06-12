"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2, Save, Trash2, Upload } from "lucide-react"
import { useTheme } from "next-themes"
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

// ==========================================
// VALIDATION SCHEMA WITH ZOD
// ==========================================
const productFormSchema = z.object({
  name: z.string().min(5, { message: "Tên sản phẩm phải có ít nhất 5 ký tự." }),
  description: z.string().optional(),
  sku: z.string().min(1, { message: "Mã SKU là bắt buộc." }),
  category: z.string().min(1, { message: "Vui lòng chọn danh mục chính." }),
  brand: z.string().optional(),
  status: z.enum(["active", "draft", "archived"]).default("active"),
  isHot: z.boolean().default(false),

  price: z.preprocess(
    (val) => Number(val) || 0,
    z.number().min(1000, { message: "Giá bán thấp nhất là 1,000đ." })
  ),
  comparePrice: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z.number().optional()
  ),
  stock: z.preprocess(
    (val) => Number(val) || 0,
    z.number().min(0, { message: "Số lượng kho không được âm." })
  ),
  weight: z.preprocess((val) => Number(val) || 0, z.number().optional()),
})

type ProductFormValues = z.infer<typeof productFormSchema>

export default function AddProductSplitPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme() // Hook điều khiển Light/Dark mode
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<{ id: string; url: string }[]>([])

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      category: "",
      brand: "",
      status: "active",
      isHot: false,
      price: 0,
      comparePrice: 0,
      stock: 0,
      weight: 0,
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substring(2, 11),
        url: URL.createObjectURL(file),
      }))
      setImages((prev) => [...prev, ...newImages].slice(0, 5))
    }
  }

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true)
    try {
      console.log("Submit Data:", data, images)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      router.push("/products")
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50/50 p-4 text-foreground transition-colors duration-300 dark:bg-zinc-950">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* TOP BAR: BACK BUTTON, ACTION BUTTONS & THEME TOGGLE */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-9 w-9 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
                Tạo sản phẩm mới
              </h1>
            </div>
          </div>

          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
            {/* Nút bấm test đổi theme nhanh đặt ngay tại header */}
            {/* <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            >
              <Sun className="h-5 w-5 scale-100 rotate-0 text-amber-500 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-5 w-5 scale-0 rotate-90 text-blue-400 transition-all dark:scale-100 dark:rotate-0" />
            </Button> */}

            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting} className="shadow-sm">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Lưu sản phẩm
            </Button>
          </div>
        </div>

        {/* MAIN TWO-COLUMN GRID LAYOUT */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* LEFT COLUMN: 2/3 WIDTH (Core Content) */}
          <div className="space-y-6 lg:col-span-2">
            {/* CARD 1: THÔNG TIN CHI TIẾT */}
            <Card className="border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">
                  Thông tin chung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="sku" className="font-medium">
                      Mã sản phẩm <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="sku"
                      placeholder="Ví dụ: SKU001"
                      className={`h-11 bg-transparent ${errors.sku ? "border-destructive focus-visible:ring-destructive" : "border-slate-200 dark:border-zinc-700"}`}
                      {...register("sku")}
                    />
                    {errors.sku && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.sku.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="name" className="font-medium">
                      Tên sản phẩm <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Ví dụ: Áo thun nam Cotton Compact Premium"
                      className={`h-11 bg-transparent ${errors.name ? "border-destructive focus-visible:ring-destructive" : "border-slate-200 dark:border-zinc-700"}`}
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-medium">
                    Mô tả chi tiết
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả các đặc tính nổi bật của sản phẩm..."
                    className="min-h-[150px] resize-none border-slate-200 bg-transparent focus-visible:ring-slate-400 dark:border-zinc-700"
                    {...register("description")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* CARD 2: MEDIA (HÌNH ẢNH) */}
            <Card className="border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">
                  Hình ảnh sản phẩm
                </CardTitle>
                <CardDescription>
                  Đăng tải từ 1 đến 5 hình ảnh vuông cho sản phẩm này.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 transition hover:bg-slate-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
                    <Upload className="mb-1 h-5 w-5 text-muted-foreground" />
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Thêm ảnh
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>

                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <img
                        src={img.url}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 transition group-hover:opacity-100 dark:bg-black/60">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-7 w-7 rounded-full shadow-md"
                          onClick={() =>
                            setImages(
                              images.filter((item) => item.id !== img.id)
                            )
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ==========================================
              RIGHT COLUMN: 1/3 WIDTH (Side Widgets)
             ========================================== */}
          <div className="space-y-6">
            {/* WIDGET 1: TRẠNG THÁI (STATUS) */}
            <Card className="border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="">
                <CardTitle className="text-sm font-semibold">
                  Trạng thái sản phẩm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  defaultValue="active"
                  onValueChange={(value) => setValue("status", value as any)}
                >
                  <SelectTrigger className="h-10 w-full border-slate-200 bg-transparent dark:border-zinc-700">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom">
                    <SelectItem value="active">
                      Đang kinh doanh (Active)
                    </SelectItem>
                    <SelectItem value="draft">Bản nháp (Draft)</SelectItem>
                    <SelectItem value="archived">Lưu trữ (Archived)</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* WIDGET 2: PHÂN LOẠI & THƯƠNG HIỆU */}
            <Card className="border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Tổ chức sản phẩm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Danh mục chính
                  </Label>
                  <Select
                    onValueChange={(value) => setValue("category", value)}
                  >
                    <SelectTrigger
                      id="category"
                      className="h-10 w-full border-slate-200 bg-transparent dark:border-zinc-700"
                    >
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom">
                      <SelectItem value="fashion">Thời trang</SelectItem>
                      <SelectItem value="electronics">Điện tử</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-xs font-medium text-destructive">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="brand"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Thương hiệu
                  </Label>
                  <Input
                    id="brand"
                    placeholder="Nhập hãng sản xuất..."
                    className="h-10 border-slate-200 bg-transparent dark:border-zinc-700"
                    {...register("brand")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* WIDGET 3: THÔNG SỐ KHÁC */}
            <Card className="border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Vận chuyển & Thuộc tính
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="weight"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Cân nặng (grams)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="0"
                    className="h-10 border-slate-200 bg-transparent dark:border-zinc-700"
                    {...register("weight")}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="isHot"
                      className="cursor-pointer text-xs font-medium"
                    >
                      Sản phẩm HOT
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Đẩy lên mục ưu tiên
                    </p>
                  </div>
                  <Switch
                    id="isHot"
                    onCheckedChange={(checked) => setValue("isHot", checked)}
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
