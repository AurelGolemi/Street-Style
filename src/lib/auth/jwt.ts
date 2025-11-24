import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

const JWT_EXPIRES_IN = '7d'

// Type Definitions
export interface TokenPayload {
  userId: string
  email: string
  role: 'user' | 'admin'
}

export interface DecodedToken extends TokenPayload {
  iat: number // Issued at (timestamp)
  exp: number // Expiration (timestamp)
}

export function generateToken(payload: TokenPayload): string {
  try {
    const token = jwt.sign(
      payload,
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
        algorithm: 'HS256', // HMAC with SHA-256
      }
    )

    return token
  } catch (error) {
    console.error('JWT Generation Error:', error)
    throw new Error('Failed to generate authentication token')
  }
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken
    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log('Token expired')
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log('Invalid token')
    }
    return null
  }
}

