import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

export interface User {
  id: string
  email: string
  phone: string | number | null
  password_hash: string
  firstName: string
  lastName: string
  emailVerified: boolean
  phoneVerified: boolean
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date | null
  failedLoginAttempts: number
  lockUntil: Date | null
  role: 'user' | 'admin'
}

export interface CreateUserInput {
  email: string
  phone?: string
  password: string
  firstName: string
  lastName: string
}

export interface UpdateUserInput {
  email?: string
  phone?: string
  password?: string
  firstName?: string
  lastName?: string
  emailVerified?: boolean
  phoneVerified?: boolean
}

class UserDatabase {
  private users: Map<string, User> = new Map()
  private emailIndex: Map<string, string> = new Map()
  private phoneIndex: Map<string, string> = new Map()

  private async simulateLatency(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 10))
  }

  async createUser(input: CreateUserInput): Promise<User> {
    await this.simulateLatency()

    const email = input.email.toLowerCase().trim()

    if (this.emailIndex.has(email)) {
      throw new Error ('Email already registered')
    }

    if (input.phone) {
      const normalizedPhone = input.phone.replace(/\D/g, '') // Remove non digits
      if (this.phoneIndex.has(normalizedPhone)) {
        throw new Error('Phone number already registered')
      }
    }

    // Hash password (NEVER store plaintext)
    const password_hash = await bcrypt.hash(input.password, 10)

    const user: User = {
      id: uuidv4(),
      email,
      phone: input.phone || null,
      password_hash,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      emailVerified: false, // Require email verification
      phoneVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: null,
      failedLoginAttempts: 0,
      lockUntil: null,
      role: 'user', // Default role
    }

    // Store in database
    this.users.set(user.id, user)
    this.emailIndex.set(email, user.id)
    if (user.phone) {
      this.phoneIndex.set(user.phone.replace(/\D/g, ''), user.id)
    }

    return user
  }

  async findUserByEmail(email: string): Promise<User | null> {
    await this.simulateLatency()

    const normalizedEmail = email.toLowerCase().trim()
    const userId = this.emailIndex.get(normalizedEmail)

    if (!userId) return null
    
    return this.users.get(userId) || null
  }

  async findUserByPhone(phone: string): Promise<User | null> {
    await this.simulateLatency()

    const normalizedPhone = phone.replace(/\D/g, '')
    const userId = this.phoneIndex.get(normalizedPhone)

    if (!userId) return null

    return this.users.get(userId) || null
  }

  async findUserById(id: string): Promise<User | null> {
    await this.simulateLatency()

    return this.users.get(id) || null
  }

  async updateUser(id: string, updates: UpdateUserInput): Promise<User> {
    await this.simulateLatency()

    const user = this.users.get(id)
    if (!user) {
      throw new Error('User not found')
    }

    // Handle email change
    if (updates.email && updates.email !== user.email) {
      const newEmail = updates.email.toLowerCase().trim()

      // Check if new email is already taken
      if (this.emailIndex.has(newEmail)) {
        throw new Error('Email already in use')
      }

      // Update indexes
      this.emailIndex.delete(user.email)
      this.emailIndex.set(newEmail, user.id)
      user.email = newEmail
      user.emailVerified = false // Must re-verify new email
    }

    // Handle phone change
    if (updates.phone !== undefined) {
      if (user.phone) {
        this.phoneIndex.delete(user.phone.replace(/\D/g, ''))
      }
      if (updates.phone) {
        const normalizedPhone = updates.phone.replace(/\D/g, '')
        if (this.phoneIndex.has(normalizedPhone)) {
          throw new Error('Phone number already in use')
        }
        this.phoneIndex.set(normalizedPhone, user.id)
        user.phoneVerified = false // Must re-verify new phone
      }
      user.phone = updates.phone || null
    }

    // Handle password change
    if (updates.password) {
      user.password_hash = await bcrypt.hash(updates.password, 10)
    }

    // Update other fields
    if (updates.firstName) user.firstName = updates.firstName.trim()
    if (updates.lastName) user.lastName = updates.lastName.trim()
    if (updates.emailVerified !== undefined) user.emailVerified = updates.emailVerified
    if (updates.phoneVerified !== undefined) user.phoneVerified = updates.phoneVerified

    user.updatedAt = new Date()

    this.users.set(user.id, user)
    return user
  }
}