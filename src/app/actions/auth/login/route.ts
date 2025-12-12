import { NextRequest, NextResponse } from "next/server"
import { userDb } from '@/data/db/users'
import { generateToken, createSecureCookie } from '@/lib/auth/jwt'

// Login API Route
export async function POST(request: NextRequest) {
  try {
    // 1. Parse & validate input
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email/phone and password are required' },
        { status: 400 }
      )
    }

    // 2. Find User
    // Try to find by email first
    let user = await userDb.findUserByEmail(email)

    // If not found and looks like phone number, try phone lookup
    if (!user && /^\+?[\d\s\-()]+$/.test(email)) {
      user = await userDb.findUserByPhone(email)
    }

    // User not found
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // 3. Check account lockout
    if (userDb.isAccountLocked(user)) {
      const lockUntil = user.lockUntil!
      const minutesRemaining = Math.ceil((lockUntil.getTime() - Date.now()) / 60000)

      return NextResponse.json(
        { 
          error: `Account is temporarily locked. Please try again in ${minutesRemaining} minutes.`,
          lockedUntil: lockUntil.toISOString()
        },
        { status: 423 } // 423 Locked
      )
    }

    // 4. Verify Password
    const isValidPassword = await userDb.verifyPassword(user, password)

    if (!isValidPassword) {
      await userDb.recordFailedLogin(user.id)

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // 5. Generate JWT Token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // 6. Record successful login
    await userDb.recordSuccessfulLogin(user.id)

    // 7. Return Response With Secure Cookie
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
    })

    // Set secure cookie
    response.headers.set('Set-Cookie', createSecureCookie(token))

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}