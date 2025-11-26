import { NextRequest, NextResponse } from 'next/server'
import { userDb } from '@/data/db/users'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await userDb.findUserByEmail(email)

    if (user) {
      // TODO: In production
      // 1. Generate reset token: crypto.randomBytes(32).toString('hex')
      // 2. Store token with expiration in database
      // 3. Send email with link: /reset-password?token=xxx
      
      console.log(`Password reset requested for: ${email}`)
      console.log(`Reset link would be: /reset-password?token=GENERATED_TOKEN`)
    }

    // Always return success (security: don't reveal if email exists
    return NextResponse.json({
      success: true,
      message: 'If that email is registered, a password reset link has been sent.',
    })
  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}