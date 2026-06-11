"use client"

import { Download, FileJson, FileSpreadsheet } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Product } from "@/lib/mock-products"

interface ProductExportProps {
  data: Product[]
}

export function ProductExport({ data }: ProductExportProps) {
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

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Tên sản phẩm",
      "SKU",
      "Danh mục",
      "Giá",
      "Tồn kho",
      "Trạng thái",
      "Nổi bật",
      "Ngày tạo",
      "Ngày cập nhật",
    ]

    const rows = data.map((product) => [
      product.id,
      product.name,
      product.sku,
      product.category,
      formatCurrency(product.price),
      product.stock,
      product.status,
      product.isHot ? "Có" : "Không",
      formatDate(product.createdAt),
      formatDate(product.updatedAt),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) =>
            typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell
          )
          .join(",")
      ),
    ].join("\n")

    downloadFile(csvContent, "products.csv", "text/csv;charset=utf-8;")
  }

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2)
    downloadFile(
      jsonContent,
      "products.json",
      "application/json;charset=utf-8;"
    )
  }

  const downloadFile = (
    content: string,
    fileName: string,
    mimeType: string
  ) => {
    const element = document.createElement("a")
    element.setAttribute("href", `data:${mimeType}base64,${btoa(content)}`)
    element.setAttribute("download", fileName)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Xuất dữ liệu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Chọn định dạng</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Xuất CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <FileJson className="mr-2 h-4 w-4" />
          Xuất JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
