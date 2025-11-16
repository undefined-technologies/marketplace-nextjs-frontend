'use client'

import { useEffect, useState } from 'react'
import { getCart, removeFromCart, updateCartItemQuantity, clearCart } from '@/lib/cart'
import { mockProducts, CartItem } from '@/lib/db'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCheckout: () => void
  onCartUpdate: () => void
}

export function CartSheet({ open, onOpenChange, onCheckout, onCartUpdate }: CartSheetProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    if (open) {
      setCartItems(getCart())
    }
  }, [open])

  const products = mockProducts.map((product) => {
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

  const cartWithProducts = cartItems.map(item => {
    const product = products.find(p => p.id === item.productId)
    return { ...item, product }
  }).filter(item => item.product)

  const total = cartWithProducts.reduce((sum, item) => {
    return sum + (item.product!.price * item.quantity)
  }, 0)

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemove(productId)
      return
    }
    updateCartItemQuantity(productId, newQuantity)
    setCartItems(getCart())
    onCartUpdate()
  }

  const handleRemove = (productId: string) => {
    removeFromCart(productId)
    setCartItems(getCart())
    onCartUpdate()
    toast.success('Producto eliminado')
  }

  const handleCheckout = () => {
    if (cartWithProducts.length === 0) {
      toast.error('Carrito vacío')
      return
    }
    onCheckout()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
          <SheetDescription>
            {cartWithProducts.length === 0
              ? 'Tu carrito está vacío'
              : `${cartWithProducts.length} producto(s) en tu carrito`}
          </SheetDescription>
        </SheetHeader>

        {cartWithProducts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              No hay productos en tu carrito
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4">
              <div className="space-y-4">
                {cartWithProducts.map((item) => (
                  <div key={item.productId} className="flex gap-4 rounded-lg border p-3">
                    <div className="relative h-20 w-20 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.product!.image || "/placeholder.svg"}
                        alt={item.product!.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-sm leading-tight">
                          {item.product!.name}
                        </h4>
                        <p className="text-sm font-bold text-primary">
                          ${item.product!.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => handleRemove(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
              >
                Proceder al Pago
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

