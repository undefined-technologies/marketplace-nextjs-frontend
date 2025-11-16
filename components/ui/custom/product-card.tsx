'use client'

import { Product } from '@/lib/db'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
  isLoggedIn: boolean
}

export function ProductCard({ product, onAddToCart, isLoggedIn }: ProductCardProps) {
  return (
    <div className="group">
      <Link href={`/product/${product.id}`}>
        <div className="relative mb-3 aspect-square overflow-hidden bg-muted sm:mb-4">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.stock < 10 && (
            <div className="absolute right-2 top-2 rounded-md bg-secondary px-2 py-1 text-xs font-light text-secondary-foreground sm:right-3 sm:top-3 sm:px-3">
              Solo {product.stock}
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-1.5 sm:space-y-2">
        <div className="text-xs font-light uppercase tracking-wider text-muted-foreground">
          {product.category}
        </div>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-base font-light text-foreground transition-colors hover:text-primary line-clamp-1 sm:text-lg">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm font-light text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="text-xl font-light text-foreground sm:text-2xl">
            ${product.price.toFixed(2)}
          </div>
          <button
            onClick={() => onAddToCart?.(product.id)}
            className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-sm font-light text-accent-foreground transition-opacity hover:opacity-80 disabled:opacity-50 sm:gap-2 sm:px-4"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Agregar</span>
          </button>
        </div>
      </div>
    </div>
  )
}

