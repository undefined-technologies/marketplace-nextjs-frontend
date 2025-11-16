'use client'

import { ShoppingCart, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CartSheet } from '@/components/ui/custom/cart-sheet'
import { CheckoutDialog } from '@/components/ui/custom/checkout-dialog'
// import { setCurrentUser } from '@/lib/auth'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface HeaderProps {
  isLoggedIn: boolean
  cartCount: number
  onCartUpdate: () => void
}

export function Header({ isLoggedIn, cartCount, onCartUpdate }: HeaderProps) {
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    // setCurrentUser(null)
    // toast.success('Sesión cerrada')
    // router.refresh()
  }

  const handleCheckout = () => {
    setShowCart(false)
    setShowCheckout(true)
  }

  const handleCheckoutComplete = () => {
    onCartUpdate()
  }

  return (
    <>
      <header className="bg-background py-3 sm:py-4">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-primary sm:h-12 sm:w-12">
              <span className="text-xl font-light text-primary-foreground sm:text-2xl">E</span>
            </div>
            <div>
              <h1 className="text-lg font-light tracking-tight text-foreground sm:text-xl">All Novu</h1>
              <p className="hidden text-xs font-light text-muted-foreground sm:block">Distribuidora</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn ? (
              <>
                <button
                  className="relative flex items-center gap-1.5 rounded-md bg-muted px-3 py-2 text-sm font-light text-foreground transition-colors hover:bg-primary/20 sm:gap-2 sm:px-4"
                  onClick={() => setShowCart(true)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Carrito</span>
                  {cartCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-secondary p-0 text-xs font-light">
                      {cartCount}
                    </Badge>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-2 text-sm font-light text-foreground transition-colors hover:bg-destructive/20 sm:gap-2 sm:px-4"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-light text-primary-foreground transition-opacity hover:opacity-80 sm:gap-2 sm:px-6"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Iniciar Sesión</span>
                <span className="sm:hidden">Login</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <CartSheet
        open={showCart}
        onOpenChange={setShowCart}
        onCheckout={handleCheckout}
        onCartUpdate={onCartUpdate}
      />

      <CheckoutDialog
        open={showCheckout}
        onOpenChange={setShowCheckout}
        onComplete={handleCheckoutComplete}
      />
    </>
  )
}

