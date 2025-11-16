'use client'

import { useEffect, useState } from 'react'
import { mockProducts, Product } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { addToCart, getCartCount } from '@/lib/cart'
import { Header } from '@/components/ui/custom/header'
import { ShoppingCart, Package, Truck, Shield } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { toast } from 'sonner'

export default function ProductPage({ params }: { params: { id: string } }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const imageMap: Record<string, string> = {
    '1': '/modern-stainless-steel-refrigerator.jpg',
    '2': '/modern-white-washing-machine.jpg',
    '3': '/stainless-steel-microwave.jpg',
    '4': '/white-air-conditioner-unit.jpg',
    '5': '/modern-gas-stove-range.jpg',
    '6': '/stainless-dishwasher.jpg',
    '7': '/white-clothes-dryer.jpg',
    '8': '/white-upright-freezer.jpg'
  }

  const { id } = useParams<{ id: string }>()

  const product = mockProducts.find(p => p.id === id)

  if (!product) {
    notFound()
  }

  const productWithImage = {
    ...product,
    image: imageMap[product.id] || product.image
  }

  useEffect(() => {
    const user = getCurrentUser()
    setIsLoggedIn(true)
    if (user) {
      setCartCount(getCartCount())
    }
  }, [])

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error('Inicia sesión para agregar productos')
      return
    }
    addToCart(productWithImage.id, quantity)
    setCartCount(getCartCount())
    toast.success(`${quantity}x ${productWithImage.name} en el carrito`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        isLoggedIn={isLoggedIn}
        cartCount={cartCount}
        onCartUpdate={() => setCartCount(getCartCount())}
      />

      <main className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-4 sm:mb-6">
          <Link href="/" className="text-sm font-light text-muted-foreground hover:text-foreground">
            ← Volver al catálogo
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={productWithImage.image || "/placeholder.svg"}
              alt={productWithImage.name}
              fill
              className="object-cover"
              priority
            />
            {productWithImage.stock < 10 && (
              <div className="absolute right-3 top-3 rounded-md bg-secondary px-3 py-2 text-sm font-light text-secondary-foreground sm:right-4 sm:top-4 sm:px-4">
                Solo {productWithImage.stock} disponibles
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <div>
              <div className="mb-2 text-xs font-light uppercase tracking-wider text-muted-foreground">
                {productWithImage.category}
              </div>
              <h1 className="mb-3 text-3xl font-light tracking-tight text-foreground sm:mb-4 sm:text-4xl">
                {productWithImage.name}
              </h1>
              <p className="text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
                {productWithImage.description}
              </p>
            </div>

            <div className="text-3xl font-light text-foreground sm:text-4xl">
              ${productWithImage.price.toFixed(2)}
            </div>

            {/* Quantity Selector */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center justify-center sm:justify-start">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-l-md bg-muted px-4 py-2 text-foreground hover:bg-primary/20"
                >
                  -
                </button>
                <div className="bg-muted px-6 py-2 font-light">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(Math.min(productWithImage.stock, quantity + 1))}
                  className="rounded-r-md bg-muted px-4 py-2 text-foreground hover:bg-primary/20"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={productWithImage.stock === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 text-base font-light text-accent-foreground transition-opacity hover:opacity-80 disabled:opacity-50 sm:px-8"
              >
                <ShoppingCart className="h-5 w-5" />
                Agregar al carrito
              </button>
            </div>

            {/* Features */}
            <div className="space-y-4 pt-6">
              <div className="flex items-start gap-4">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-light text-foreground">Envío gratis</div>
                  <div className="text-sm font-light text-muted-foreground">En compras mayores a $500</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-light text-foreground">Garantía extendida</div>
                  <div className="text-sm font-light text-muted-foreground">2 años de garantía del fabricante</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-light text-foreground">Disponibilidad</div>
                  <div className="text-sm font-light text-muted-foreground">
                    {productWithImage.stock > 0 ? `${productWithImage.stock} unidades en stock` : 'Agotado'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

