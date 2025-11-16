import { CartItem } from './db'
import { STORAGE_KEYS } from './auth'

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  const cart = localStorage.getItem(STORAGE_KEYS.CART)
  return cart ? JSON.parse(cart) : []
}

export function saveCart(cart: CartItem[]): void {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart))
}

export function addToCart(productId: string, quantity: number = 1): void {
  const cart = getCart()
  const existingItem = cart.find(item => item.productId === productId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({ productId, quantity })
  }

  saveCart(cart)
}

export function removeFromCart(productId: string): void {
  const cart = getCart()
  const filtered = cart.filter(item => item.productId !== productId)
  saveCart(filtered)
}

export function updateCartItemQuantity(productId: string, quantity: number): void {
  const cart = getCart()
  const item = cart.find(item => item.productId === productId)

  if (item) {
    item.quantity = quantity
    saveCart(cart)
  }
}

export function clearCart(): void {
  saveCart([])
}

export function getCartCount(): number {
  return getCart().reduce((total, item) => total + item.quantity, 0)
}
