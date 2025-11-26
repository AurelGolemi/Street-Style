import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromCookie } from '@/lib/auth/jwt'
import { userDb } from '@/data/db/users'

// Get Current User API Route
export async function GET(request: NextRequest) {
  try {
    // 1. Extract Token From Cookie
    const cookieHeader = request.headers.get('cookie')
    const token = extractTokenFromCookie(cookieHeader)

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // 2. Verify Token
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // 3. Fetch User from Database
    const user = await userDb.findUserById(decoded.userId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // 4. Return User Data
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Authentication check failed' },
      { status: 500 }
    )
  }
}