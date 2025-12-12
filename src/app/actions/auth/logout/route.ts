import { NextRequest, NextResponse } from 'next/server'
import { deleteCookie } from '@/lib/auth/jwt'

// Logout API Route
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })

    // Delete session cookie
    response.headers.set('Set-Cookie', deleteCookie())

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    )
  }
}