import { User } from './db'


// Simulated email service
export function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  console.log(`[v0] Sending verification email to ${email} with code: ${code}`)
  // Simulate email sending
  return Promise.resolve(true)
}

// Generate random verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Local storage keys
export const STORAGE_KEYS = {
  USERS: 'electrodomesticos_users',
  CURRENT_USER: 'electrodomesticos_current_user',
  CART: 'electrodomesticos_cart',
  ORDERS: 'electrodomesticos_orders',
  VERIFICATION_CODES: 'electrodomesticos_verification_codes'
}

// User management functions
export function getUsers(): User[] {
  if (typeof window === 'undefined') return []
  const users = localStorage.getItem(STORAGE_KEYS.USERS)
  return users ? JSON.parse(users) : []
}

export function saveUser(user: User): void {
  const users = getUsers()
  users.push(user)
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

export function updateUser(userId: string, updates: Partial<User>): void {
  const users = getUsers()
  const index = users.findIndex(u => u.id === userId)
  if (index !== -1) {
    users[index] = { ...users[index], ...updates }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  }
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email === email)
}

export function findUserByUsername(username: string): User | undefined {
  return getUsers().find(u => u.username === username)
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return user ? JSON.parse(user) : null
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

export function validatePassword(password: string): boolean {
  return password.length >= 6
}

export function registerUser(userData: {
  email: string
  password: string
  phone: string
  fullName: string
  username: string
}): { success: boolean; message?: string; verificationCode?: string } {
  // Validar que no exista el email
  if (findUserByEmail(userData.email)) {
    return { success: false, message: 'El email ya está registrado' }
  }

  // Validar que no exista el username
  if (findUserByUsername(userData.username)) {
    return { success: false, message: 'El nombre de usuario ya existe' }
  }

  // Validar contraseña
  if (!validatePassword(userData.password)) {
    return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' }
  }

  // Generar código de verificación
  const verificationCode = generateVerificationCode()

  // Crear usuario
  const newUser: User = {
    id: Date.now().toString(),
    email: userData.email,
    password: userData.password,
    phone: userData.phone,
    fullName: userData.fullName,
    username: userData.username,
    emailVerified: false,
  }

  // Guardar usuario
  saveUser(newUser)

  // Guardar código de verificación
  const codes = getVerificationCodes()
  codes[userData.email] = verificationCode
  saveVerificationCodes(codes)

  // Simular envío de email
  sendVerificationEmail(userData.email, verificationCode)

  return { success: true, verificationCode }
}

export function loginUser(email: string, password: string): boolean {
  const user = findUserByEmail(email)

  if (!user) {
    return false
  }

  if (!user.isVerified) {
    return false
  }

  if (user.password !== password) {
    return false
  }

  setCurrentUser(user)
  return true
}

function getVerificationCodes(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const codes = localStorage.getItem(STORAGE_KEYS.VERIFICATION_CODES)
  return codes ? JSON.parse(codes) : {}
}

function saveVerificationCodes(codes: Record<string, string>): void {
  localStorage.setItem(STORAGE_KEYS.VERIFICATION_CODES, JSON.stringify(codes))
}

export function sendVerificationCode(email: string): { success: boolean; code?: string } {
  const user = findUserByEmail(email)
  if (!user) {
    return { success: false }
  }

  const code = generateVerificationCode()
  const codes = getVerificationCodes()
  codes[email] = code
  saveVerificationCodes(codes)

  sendVerificationEmail(email, code)
  return { success: true, code }
}

export function verifyEmail(email: string, code: string): boolean {
  const codes = getVerificationCodes()

  if (codes[email] !== code) {
    return false
  }

  // Marcar usuario como verificado
  const users = getUsers()
  const userIndex = users.findIndex(u => u.email === email)

  if (userIndex === -1) {
    return false
  }

  users[userIndex].isVerified = true
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))

  // Eliminar código usado
  delete codes[email]
  saveVerificationCodes(codes)

  return true
}

