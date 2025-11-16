'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getCart, clearCart } from '@/lib/cart'
import { mockProducts } from '@/lib/db'
// import { getCurrentUser } from '@/lib/auth'
// import { STORAGE_KEYS } from '@/lib/auth'
import { MapPin, Package, CreditCard } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

export function CheckoutDialog({ open, onOpenChange, onComplete }: CheckoutDialogProps) {
  const [step, setStep] = useState<'summary' | 'location' | 'confirm'>('summary')
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const cartItems = getCart()
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

  const handleContinueToLocation = () => {
    setStep('location')
  }

  const handleLocationSelected = (lat: number, lng: number, address: string) => {
    setSelectedLocation({ lat, lng, address })
    setStep('confirm')
  }

  const handleConfirmOrder = async () => {
    // if (!selectedLocation) return
    //
    // setIsProcessing(true)
    //
    // try {
    //   const user = getCurrentUser()
    //   if (!user) return
    //
    //   // Create order
    //   const order = {
    //     id: Date.now().toString(),
    //     userId: user.id,
    //     items: cartItems,
    //     total,
    //     deliveryAddress: selectedLocation,
    //     status: 'pending',
    //     createdAt: new Date().toISOString()
    //   }
    //
    //   // Save order to localStorage
    //   const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]')
    //   orders.push(order)
    //   localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
    //
    //   // Clear cart
    //   clearCart()
    //
    //   toast.success('Orden confirmada')
    //
    //   onComplete()
    //   onOpenChange(false)
    //   setStep('summary')
    //   setSelectedLocation(null)
    // } catch (error) {
    //   toast.error('Ocurrió un error al procesar tu orden')
    // } finally {
    //   setIsProcessing(false)
    // }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Finalizar Compra</DialogTitle>
          <DialogDescription>
            {step === 'summary' && 'Revisa tu orden antes de continuar'}
            {step === 'location' && 'Selecciona la ubicación de entrega en el mapa'}
            {step === 'confirm' && 'Confirma tu pedido'}
          </DialogDescription>
        </DialogHeader>

        {step === 'summary' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Package className="h-4 w-4" />
                Resumen de la Orden
              </div>
              <div className="max-h-[300px] space-y-3 overflow-auto">
                {cartWithProducts.map((item) => (
                  <div key={item.productId} className="flex gap-3 rounded-lg border p-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.product!.image || "/placeholder.svg"}
                        alt={item.product!.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <h4 className="text-sm font-semibold">{item.product!.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Cantidad: {item.quantity}
                        </span>
                        <span className="text-sm font-bold text-primary">
                          ${(item.product!.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handleContinueToLocation}>
              Continuar a Selección de Ubicación
            </Button>
          </div>
        )}

        {step === 'location' && (
          <LocationSelector onLocationSelected={handleLocationSelected} />
        )}

        {step === 'confirm' && selectedLocation && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="h-4 w-4" />
                Dirección de Entrega
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm">{selectedLocation.address}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold">
                <CreditCard className="h-4 w-4" />
                Total a Pagar
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep('location')}
                disabled={isProcessing}
              >
                Cambiar Ubicación
              </Button>
              <Button
                className="flex-1"
                onClick={handleConfirmOrder}
                disabled={isProcessing}
              >
                {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function LocationSelector({ onLocationSelected }: { onLocationSelected: (lat: number, lng: number, address: string) => void }) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [address, setAddress] = useState('')

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    // Load Leaflet JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => {
      setMapLoaded(true)
    }
    document.body.appendChild(script)

    return () => {
      document.head.removeChild(link)
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (!mapLoaded) return

    const L = (window as any).L

    const map = L.map('map').setView([23.1339, -82.3586], 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

    let marker: any = null

    // Add click handler
    map.on('click', async (e: any) => {
      const { lat, lng } = e.latlng

      // Remove previous marker
      if (marker) {
        map.removeLayer(marker)
      }

      // Add new marker
      marker = L.marker([lat, lng]).addTo(map)

      setSelectedPosition({ lat, lng })

      // Reverse geocoding (simplified - in production use a proper API)
      const addressText = `Ubicación seleccionada: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
      setAddress(addressText)
    })

    return () => {
      map.remove()
    }
  }, [mapLoaded])

  const handleConfirm = () => {
    if (selectedPosition) {
      onLocationSelected(selectedPosition.lat, selectedPosition.lng, address || 'Ubicación seleccionada')
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          Haz clic en el mapa para seleccionar la ubicación de entrega
        </p>
      </div>

      <div id="map" className="h-[400px] w-full rounded-lg border" />

      {selectedPosition && (
        <div className="rounded-lg border bg-accent/10 p-4">
          <p className="text-sm font-medium">Ubicación seleccionada:</p>
          <p className="text-xs text-muted-foreground">
            Latitud: {selectedPosition.lat.toFixed(6)}, Longitud: {selectedPosition.lng.toFixed(6)}
          </p>
        </div>
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={handleConfirm}
        disabled={!selectedPosition}
      >
        Confirmar Ubicación
      </Button>
    </div>
  )
}

