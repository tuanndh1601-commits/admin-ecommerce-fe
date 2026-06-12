"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import {
  DeleteConfirmDialog,
  ProductDialog,
} from "@/components/products/product-dialog"
import { ProductExport } from "@/components/products/product-export"
import {
  FilterConfig,
  ProductFilter,
} from "@/components/products/product-filter"
import { ProductPagination } from "@/components/products/product-pagination"
import { ProductTable } from "@/components/products/product-table"
import { Button } from "@/components/ui/button"
import { Product, mockProducts } from "@/lib/mock-products"
import Link from "next/link"

export default function ProductsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState<FilterConfig>({
    searchName: "",
    category: [],
    status: [],
    stock: "all",
    isHot: "all",
    priceRange: [0, 2000000],
  })

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleteMultipleOpen, setIsDeleteMultipleOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(
        mockProducts.map((p) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
        }))
      )
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search by name
      if (
        filters.searchName &&
        !product.name.toLowerCase().includes(filters.searchName.toLowerCase())
      ) {
        return false
      }

      // Filter by category
      if (
        filters.category.length > 0 &&
        !filters.category.includes(product.category)
      ) {
        return false
      }

      // Filter by status
      if (
        filters.status.length > 0 &&
        !filters.status.includes(product.status)
      ) {
        return false
      }

      // Filter by stock
      if (
        filters.stock === "low" &&
        (product.stock >= 50 || product.stock === 0)
      ) {
        return false
      }
      if (filters.stock === "out" && product.stock !== 0) {
        return false
      }

      // Filter by hot products
      if (filters.isHot === "true" && !product.isHot) {
        return false
      }
      if (filters.isHot === "false" && product.isHot) {
        return false
      }

      // Filter by price range
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false
      }

      return true
    })
  }, [products, filters])

  // Paginate filtered products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredProducts.slice(startIndex, endIndex)
  }, [filteredProducts, currentPage, pageSize])

  const totalPages = Math.ceil(filteredProducts.length / pageSize)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  // Handle row selection
  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedRows(paginatedProducts.map((p) => p.id))
    } else {
      setSelectedRows([])
    }
  }

  // Handle CRUD operations
  const handleCreate = () => {
    setEditingProduct(undefined)
    setIsDialogOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  const handleSave = (product: Product) => {
    setIsSaving(true)
    setTimeout(() => {
      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...product, updatedAt: new Date() } : p
          )
        )
      } else {
        setProducts((prev) => [
          ...prev,
          {
            ...product,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ])
      }
      setIsDialogOpen(false)
      setEditingProduct(undefined)
      setIsSaving(false)
    }, 500)
  }

  const handleDelete = (product: Product) => {
    setDeleteProduct(product)
    setIsDeleteOpen(true)
  }

  const handleDeleteMultiple = (products: Product[]) => {
    setIsDeleteMultipleOpen(true)
  }

  const handleConfirmDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      if (deleteProduct) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id))
        setDeleteProduct(null)
      }
      setIsDeleteOpen(false)
      setIsDeleting(false)
    }, 500)
  }

  const handleConfirmDeleteMultiple = () => {
    setIsDeleting(true)
    setTimeout(() => {
      setProducts((prev) => prev.filter((p) => !selectedRows.includes(p.id)))
      setSelectedRows([])
      setIsDeleteMultipleOpen(false)
      setIsDeleting(false)
    }, 500)
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header with Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Danh sách sản phẩm
        </h1>
        <div className="flex gap-2">
          <ProductExport data={filteredProducts} />
          <Button asChild size="sm">
            <Link href="/products/add">
              <Plus />
              Thêm sản phẩm
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ProductFilter
        onFilterChange={setFilters}
        categories={Array.from(new Set(products.map((p) => p.category)))}
      />

      {/* Table */}
      <ProductTable
        data={paginatedProducts}
        isLoading={isLoading}
        selectedRows={selectedRows}
        onSelectRow={handleSelectRow}
        onSelectAll={handleSelectAll}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeleteMultiple={handleDeleteMultiple}
        onViewDetail={(slug) => router.push(`/products/${slug}`)}
      />

      {/* Pagination */}
      {!isLoading && filteredProducts.length > 0 && (
        <ProductPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredProducts.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setCurrentPage(1)
          }}
        />
      )}

      {/* Dialogs */}
      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingProduct(undefined)
        }}
        product={editingProduct}
        onSave={handleSave}
        isLoading={isSaving}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setDeleteProduct(null)
        }}
        product={deleteProduct}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteMultipleOpen}
        onClose={() => setIsDeleteMultipleOpen(false)}
        product={null}
        onConfirm={handleConfirmDeleteMultiple}
        isLoading={isDeleting}
        isMultiple={true}
        count={selectedRows.length}
      />
    </div>
  )
}
