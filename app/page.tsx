'use client'

import { useEffect, useState } from 'react'
import { mockProducts, Product } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { addToCart, getCartCount } from '@/lib/cart'
import { ProductCard } from '@/components/ui/custom/product-card'
import { Header } from '@/components/ui/custom/header'
import { toast } from 'sonner'

export default function Home() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const products: Product[] = mockProducts.map((product) => {
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
    return {
      ...product,
      image: imageMap[product.id] || product.image
    }
  })

  useEffect(() => {
    const user = getCurrentUser()
    setIsLoggedIn(!!user)
    if (user) {
      setCartCount(getCartCount())
    }
    // setIsLoggedIn(true)
  }, [])

  const handleAddToCart = (productId: string) => {
    if (!isLoggedIn) {
      toast.error('Inicia sesión para agregar productos')
      return
    }
    addToCart(productId, 1)
    setCartCount(getCartCount())
    const product = products.find(p => p.id === productId)
    toast.success(`${product?.name} en el carrito`)
  }

  const categories = Array.from(new Set(products.map(p => p.category)))
  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products

  return (
    <div className="min-h-screen bg-background">
      <Header
        isLoggedIn={isLoggedIn}
        cartCount={cartCount}
        onCartUpdate={() => setCartCount(getCartCount())}
      />

      <main className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <h2 className="mb-3 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            Electrodomésticos
          </h2>
          <p className="text-base text-muted-foreground font-light sm:text-lg">
            Productos de calidad para tu hogar
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 sm:mb-10 sm:gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-md px-4 py-2 text-sm font-light transition-colors sm:px-6 ${!selectedCategory
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-primary/20'
              }`}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-md px-4 py-2 text-sm font-light transition-colors sm:px-6 ${selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-primary/20'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
