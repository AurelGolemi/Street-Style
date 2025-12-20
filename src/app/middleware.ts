// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Why middleware: Runs before every request, allowing us to check auth
  // and redirect/modify requests before they reach page components.

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })
  // Why NextResponse.next: Creates a response that continues to the next
  // handler (your page). We'll modify this response as needed.

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Why custom cookie handlers: Middleware can't use Next.js's cookies()
        // directly. We need to implement get/set/remove manually using the
        // request and response objects.
        
        get(name: string) {
          // Read cookie from incoming request
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Set cookie on both request (for this middleware execution)
          // and response (to send back to browser)
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
          // Remove cookie by setting empty value
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
    }
  )

  // Why getUser: Checks if there's a valid session. Returns user object
  // if authenticated, null if not. This hits Supabase's auth endpoint.
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  // Why pathname: Gets just the path part of URL (/login, /profile, etc)

  // Protected routes: require authentication
  const protectedRoutes = ['/profile', '/cart', '/checkout', '/orders']
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  // Why some: Checks if path starts with any protected route prefix

  // Auth routes: login/register pages
  const authRoutes = ['/login', '/register']
  const isAuthRoute = authRoutes.some(route => path.startsWith(route))

  // Redirect logic
  if (!user && isProtectedRoute) {
    // Not logged in but trying to access protected page → send to login
    console.log('Redirecting to login: user not authenticated')
    return NextResponse.redirect(new URL('/login', request.url))
    // Why new URL: Constructs absolute URL from relative path
  }

  if (user && isAuthRoute) {
    // Logged in but trying to access login/register → send to home
    console.log('Redirecting to home: user already authenticated')
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Why return response: Send the (potentially modified) response to Next.js
  return response
}

export const config = {
  // Why matcher: Tells Next.js which routes to run middleware on.
  // This regex excludes static files (images, fonts) and Next.js internals.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
