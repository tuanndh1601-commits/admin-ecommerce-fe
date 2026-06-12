"use client"

import { ChevronDown, FilterX, SlidersHorizontal, X } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

export interface FilterConfig {
  searchName: string
  category: string[]
  status: string[]
  stock: string // "all" | "low" | "out"
  isHot: string // "all" | "true" | "false"
  priceRange: [number, number]
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterConfig) => void
  categories: string[]
}

const CATEGORIES = ["Áo", "Quần", "Giày", "Túi", "Phụ Kiện"]
const STATUSES = ["active", "inactive", "discontinued"]

export function ProductFilter({
  onFilterChange,
  categories = CATEGORIES,
}: ProductFilterProps) {
  const [filters, setFilters] = useState<FilterConfig>({
    searchName: "",
    category: [],
    status: [],
    stock: "all",
    isHot: "all",
    priceRange: [0, 2000000],
  })

  const [isAdvanced, setIsAdvanced] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  useEffect(() => {
    const updatedFilters = {
      ...filters,
      category: selectedCategories,
      status: selectedStatuses,
    }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }, [selectedCategories, selectedStatuses])

  const handleSearchChange = (value: string) => {
    const updatedFilters = { ...filters, searchName: value }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const handleStockChange = (value: string) => {
    const updatedFilters = { ...filters, stock: value }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const handleHotChange = (value: string) => {
    const updatedFilters = { ...filters, isHot: value }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const numValue = Number(value) || 0
    const newRange: [number, number] =
      type === "min"
        ? [numValue, filters.priceRange[1]]
        : [filters.priceRange[0], numValue]

    const updatedFilters = { ...filters, priceRange: newRange }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedStatuses([])
    const clearedFilters: FilterConfig = {
      searchName: "",
      category: [],
      status: [],
      stock: "all",
      isHot: "all",
      priceRange: [0, 2000000],
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters =
    filters.searchName !== "" ||
    selectedCategories.length > 0 ||
    selectedStatuses.length > 0 ||
    filters.stock !== "all" ||
    filters.isHot !== "all" ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 2000000

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="w-80">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={filters.searchName}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-9"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex gap-2">
          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <FilterX className="h-4 w-4" />
                Danh mục
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Chọn danh mục</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {CATEGORIES.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => {
                    setSelectedCategories((prev) =>
                      prev.includes(category)
                        ? prev.filter((c) => c !== category)
                        : [...prev, category]
                    )
                  }}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <FilterX className="h-4 w-4" />
                Trạng thái
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Chọn trạng thái</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {STATUSES.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={() => {
                    setSelectedStatuses((prev) =>
                      prev.includes(status)
                        ? prev.filter((s) => s !== status)
                        : [...prev, status]
                    )
                  }}
                >
                  {status === "active"
                    ? "Hoạt động"
                    : status === "inactive"
                      ? "Không hoạt động"
                      : "Ngừng kinh doanh"}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            {/* Advanced Filter Button */}
            <PopoverTrigger asChild>
              <Button
                variant={isAdvanced ? "default" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => setIsAdvanced(!isAdvanced)} // Giữ lại state nếu bạn cần xử lý logic khác, hoặc bỏ hẳn nếu chỉ cần đóng/mở
              >
                <SlidersHorizontal className="h-4 w-4" />
                Nâng cao
              </Button>
            </PopoverTrigger>
            {/* Khung nội dung Dropdown đổ xuống */}
            <PopoverContent align="end" className="w-[350px] p-4 sm:w-[450px]">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Stock Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tồn kho</label>
                  <Select
                    value={filters.stock}
                    onValueChange={handleStockChange}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="low">Sắp hết (&lt; 50)</SelectItem>
                      <SelectItem value="out">Hết hàng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Hot Products Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Sản phẩm nổi bật
                  </label>
                  <Select value={filters.isHot} onValueChange={handleHotChange}>
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="true">Nổi bật</SelectItem>
                      <SelectItem value="false">Thường</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Min Price */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Giá từ</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceChange("min", e.target.value)}
                    className="h-9"
                  />
                </div>

                {/* Max Price */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Giá đến</label>
                  <Input
                    type="number"
                    placeholder="2000000"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange("max", e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-secondary/30 p-3">
          <span className="text-sm font-medium text-muted-foreground">
            Đang lọc:
          </span>

          {filters.searchName && (
            <div className="flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-sm">
              <span>Tên: {filters.searchName}</span>
              <button
                onClick={() => handleSearchChange("")}
                className="ml-1 hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {selectedCategories.map((category) => (
            <div
              key={category}
              className="flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-sm"
            >
              <span>{category}</span>
              <button
                onClick={() =>
                  setSelectedCategories((prev) =>
                    prev.filter((c) => c !== category)
                  )
                }
                className="ml-1 hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {selectedStatuses.map((status) => (
            <div
              key={status}
              className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-sm"
            >
              <span>
                {status === "active"
                  ? "Hoạt động"
                  : status === "inactive"
                    ? "Không hoạt động"
                    : "Ngừng KD"}
              </span>
              <button
                onClick={() =>
                  setSelectedStatuses((prev) =>
                    prev.filter((s) => s !== status)
                  )
                }
                className="ml-1 hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {filters.stock !== "all" && (
            <div className="flex items-center gap-1 rounded-full bg-orange-500/20 px-3 py-1 text-sm">
              <span>{filters.stock === "low" ? "Sắp hết" : "Hết hàng"}</span>
              <button
                onClick={() => handleStockChange("all")}
                className="ml-1 hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {filters.isHot !== "all" && (
            <div className="flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-sm">
              <span>{filters.isHot === "true" ? "Nổi bật" : "Thường"}</span>
              <button
                onClick={() => handleHotChange("all")}
                className="ml-1 hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {(filters.priceRange[0] !== 0 ||
            filters.priceRange[1] !== 2000000) && (
            <div className="flex items-center gap-1 rounded-full bg-purple-500/20 px-3 py-1 text-sm">
              <span>
                {filters.priceRange[0].toLocaleString()} -{" "}
                {filters.priceRange[1].toLocaleString()}đ
              </span>
              <button
                onClick={() => {
                  handlePriceChange("min", "0")
                  handlePriceChange("max", "2000000")
                }}
                className="ml-1 hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="ml-auto text-xs"
          >
            Xóa tất cả
          </Button>
        </div>
      )}
    </div>
  )
}
