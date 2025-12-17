import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { verifyToken, extractTokenFromCookie } from '@/lib/auth/jwt'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Check JWT token first
  const cookieHeader = request.headers.get('cookie') ?? undefined
  const token = extractTokenFromCookie(cookieHeader)
  const isJWTValid = token ? verifyToken(token) : null

  // If JWT is valid, allow access
  if (isJWTValid) {
    // Allow protected routes
    return response
  }

  // Fallback to Supabase if JWT fails
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    },
  )

  const { data: { user: supabaseUser } } = await supabase.auth.getUser()

  // Redirect unauthenticated users from protected routes
  if (!isJWTValid && !supabaseUser) {
    if (
      request.nextUrl.pathname.startsWith('/cart') ||
      request.nextUrl.pathname.startsWith('/account')
    ) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (isJWTValid || supabaseUser) {
    if (
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/register')
    ) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}