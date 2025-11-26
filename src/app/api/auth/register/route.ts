import { NextRequest, NextResponse } from 'next/server'
import { userDb } from '@/data/db/users'
import { generateToken, createSecureCookie } from '@/lib/auth/jwt'

// Register API Route
export async function POST(request: NextRequest) {
  try {
    // 1. Parse Input
    const body = await request.json()
    const { email, phone, password, confirmPassword, firstName, lastName } = body

    // 2. Validate Required Fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required', field: 'email' },
        { status: 400 }
      )
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required', field: 'password' },
        { status: 400 }
      )
    }

    if (!confirmPassword) {
      return NextResponse.json(
        { error: 'Please confirm your password', field: 'confirmPassword' },
        { status: 400 }
      )
    }

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First and last name are required', field: 'firstName' },
        { status: 400 }
      )
    }

    // 3. Validate Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format', field: 'email' },
        { status: 400 }
      )
    }

    // 4. If provided, validate phone format
    if (phone) {
      // Remove all non-digit characters
      const digitsOnly = phone.replace(/\D/g, '')

      // Check if valid length (10-15 digits)
      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        return NextResponse.json(
          { error: 'Invalid phone number format', field: 'phone' },
          { status: 400 }
        )
      }
    }

    // 5. Validate Password Strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long', field: 'password' },
        { status: 400 }
      )
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter', field: 'password' },
        { status: 400 }
      )
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one lowercase letter', field: 'password' },
        { status: 400 }
      )
    }

    // Check for number
    if (!/\d/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one number', field: 'password' },
        { status: 400 }
      )
    }

    // Validate Password Match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match', field: 'confirmPassword' },
        { status: 400 }
      )
    }

    // 7. Validate Name Length
    if (firstName.trim().length === 0 || firstName.length > 50) {
      return NextResponse.json(
        { error: 'First name must be between 1 and 50 characters', field: 'firstName' },
        { status: 400 }
      )
    }

    if (lastName.trim().length === 0 || lastName.length > 50) {
      return NextResponse.json(
        { error: 'Last name must be between 1 and 50 characters', field: 'lastName' },
        { status: 400 }
      )
    }

    // 8. Create User
    try {
      const user = await userDb.createUser({
        email,
        phone: phone || undefined,
        password,
        firstName,
        lastName,
      })

      // Generate JWT Token (auto-login after registration)

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      // 10. Return Success with secure cookie
      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      }, { status: 201 })

      response.headers.set('Set-Cookie', createSecureCookie(token))

      return response
    } catch (error) {
      // Handle database erorrs
      if (error instanceof Error) {
        if (error.message.includes('Email already registered')) {
          return NextResponse.json(
            { error: 'This email is already registered', field: 'email' },
            { status: 400 }
          )
        }
        if (error.message.includes('Phone number already registered')) {
          return NextResponse.json(
            { error: 'This phone number is already registered', field: 'phone' },
            { status: 400 }
          )
        }
      }
      throw error
    }
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}