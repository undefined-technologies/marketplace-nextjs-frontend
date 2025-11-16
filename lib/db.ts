export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
}

export interface User {
  id: string
  email: string
  phone: string
  fullName: string
  username: string
  password: string
  emailVerified: boolean
  verificationCode?: string
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  deliveryAddress: {
    lat: number
    lng: number
    address: string
  }
  status: string
  createdAt: string
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Refrigerador LG 500L',
    description: 'Refrigerador de doble puerta con tecnología inverter, eficiencia energética A+++',
    price: 1299.99,
    image: '/modern-stainless-steel-refrigerator.jpg',
    category: 'Refrigeración',
    stock: 15
  },
  {
    id: '2',
    name: 'Lavadora Samsung 15kg',
    description: 'Lavadora de carga frontal con 12 programas de lavado y función vapor',
    price: 899.99,
    image: '/modern-white-washing-machine.jpg',
    category: 'Lavado',
    stock: 20
  },
  {
    id: '3',
    name: 'Microondas Whirlpool 1.2cu',
    description: 'Microondas digital con grill, 1200W de potencia y plato giratorio',
    price: 189.99,
    image: '/stainless-steel-microwave.jpg',
    category: 'Cocina',
    stock: 30
  },
  {
    id: '4',
    name: 'Aire Acondicionado Daikin 12000 BTU',
    description: 'Split inverter silencioso con control remoto y modo eco',
    price: 749.99,
    image: '/white-air-conditioner-unit.jpg',
    category: 'Climatización',
    stock: 12
  },
  {
    id: '5',
    name: 'Cocina Mabe 6 Hornillas',
    description: 'Cocina a gas con horno eléctrico, parrillas de hierro fundido',
    price: 599.99,
    image: '/modern-gas-stove-range.jpg',
    category: 'Cocina',
    stock: 8
  },
  {
    id: '6',
    name: 'Lavavajillas Bosch 14 Servicios',
    description: 'Lavavajillas con 6 programas, bajo consumo de agua y energía',
    price: 699.99,
    image: '/stainless-dishwasher.jpg',
    category: 'Cocina',
    stock: 10
  },
  {
    id: '7',
    name: 'Secadora Electrolux 10kg',
    description: 'Secadora con sensor de humedad y múltiples programas de secado',
    price: 649.99,
    image: '/white-clothes-dryer.jpg',
    category: 'Lavado',
    stock: 18
  },
  {
    id: '8',
    name: 'Congelador Vertical Frigidaire 300L',
    description: 'Congelador vertical con sistema No Frost y 5 cajones',
    price: 549.99,
    image: '/white-upright-freezer.jpg',
    category: 'Refrigeración',
    stock: 7
  }
]

