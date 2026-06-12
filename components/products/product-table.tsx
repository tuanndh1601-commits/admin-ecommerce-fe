"use client"

import { Check, Copy, Edit2, MoreHorizontal, Trash2 } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Product } from "@/lib/mock-products"

interface ProductTableProps {
  data: Product[]
  isLoading: boolean
  selectedRows: string[]
  onSelectRow: (id: string) => void
  onSelectAll: (selected: boolean) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onDeleteMultiple: (products: Product[]) => void
  onViewDetail: (slug: string) => void
}

export function ProductTable({
  data,
  isLoading,
  selectedRows,
  onSelectRow,
  onSelectAll,
  onEdit,
  onDelete,
  onDeleteMultiple,
  onViewDetail,
}: ProductTableProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopySKU = (sku: string) => {
    navigator.clipboard.writeText(sku)
    setCopied(sku)
    setTimeout(() => setCopied(null), 2000)
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Hoạt động"
      case "inactive":
        return "Không hoạt động"
      case "discontinued":
        return "Ngừng KD"
      default:
        return status
    }
  }

  const selectedProducts = data.filter((p) => selectedRows.includes(p.id))

  if (isLoading) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="hidden xl:table-cell">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-4 w-8" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
          <span className="text-sm font-medium text-muted-foreground">
            {selectedRows.length} sản phẩm được chọn
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDeleteMultiple(selectedProducts)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa {selectedRows.length} sản phẩm
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectAll(false)}
          >
            Bỏ chọn
          </Button>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="">
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedRows.length > 0 &&
                    selectedRows.length === data.length
                  }
                  onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                />
              </TableHead>
              <TableHead className="">Thao tác</TableHead>
              <TableHead className="hidden md:table-cell">
                Tên sản phẩm
              </TableHead>
              <TableHead className="hidden md:table-cell">SKU</TableHead>
              <TableHead className="hidden md:table-cell">Danh mục</TableHead>
              <TableHead className="hidden sm:table-cell">Giá</TableHead>
              <TableHead className="hidden lg:table-cell">Tồn kho</TableHead>
              <TableHead className="hidden xl:table-cell">Trạng thái</TableHead>
              <TableHead className="hidden xl:table-cell">Ngày tạo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Không tìm thấy sản phẩm nào
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              data.map((product) => {
                const isSelected = selectedRows.includes(product.id)
                const isLowStock = product.stock < 50 && product.stock > 0
                const isOutOfStock = product.stock === 0

                return (
                  <TableRow
                    key={product.id}
                    className={
                      isSelected ? "bg-blue-50 dark:bg-blue-950/20" : ""
                    }
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onSelectRow(product.id)}
                      />
                    </TableCell>
                    <TableCell className="">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(product)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(product)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="max-w-xs font-medium">
                      <button
                        onClick={() => onViewDetail(product.slug)}
                        className="flex items-center gap-2 text-primary transition-opacity hover:underline hover:opacity-70"
                      >
                        <span className="truncate">{product.name}</span>
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-muted px-2 py-1 text-xs">
                          {product.sku}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          {copied === product.sku ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm md:table-cell">
                      {product.category}
                    </TableCell>
                    <TableCell className="hidden text-sm font-medium sm:table-cell">
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex gap-2">
                        {isOutOfStock ? (
                          <Badge
                            variant="outline"
                            className="border-red-300 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          >
                            Hết hàng
                          </Badge>
                        ) : isLowStock ? (
                          <Badge
                            variant="outline"
                            className="border-orange-300 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                          >
                            {product.stock}
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-green-300 bg-green-100 align-middle text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          >
                            {product.stock}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <Badge className={getStatusColor(product.status)}>
                        {getStatusLabel(product.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-sm xl:table-cell">
                      {formatDate(product.createdAt)}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
