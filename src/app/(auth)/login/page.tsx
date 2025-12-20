'use client'

import { useState, useTransition } from 'react'
import { signIn } from '@/app/actions/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  // Why useState for error: We need to store and display error messages
  // in the UI. State persists across re-renders.
  const [error, setError] = useState<string | null>(null)
  
  // Why useTransition: This React hook gives us 'isPending' state for
  // server actions. It's more reliable than managing loading state manually.
  const [isPending, startTransition] = useTransition()
  
  // Why useRouter: Backup navigation in case redirect fails
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Why preventDefault: Stops the browser's default form submission
    // (which would reload the page). We want to handle it with JavaScript.
    
    setError(null)
    // Clear any previous errors before attempting new login

    const formData = new FormData(e.currentTarget)
    // Why e.currentTarget: Gets the form element that triggered the event.
    // This gives us access to all form fields via FormData API.

    // Why startTransition: Wraps the async operation and automatically
    // sets isPending to true during execution, false when complete.
    startTransition(async () => {
      try {
        const result = await signIn(formData)
        // Server action returns undefined on success (due to redirect)
        // or {error: string} on failure

        if (result?.error) {
          // If we got an error back, display it
          setError(result.error)
        } else {
          // Success case: redirect worked, but if we reach here (shouldn't happen),
          // manually navigate as backup
          router.push('/')
          router.refresh()
          // Why refresh: Forces Next.js to refetch server components,
          // ensuring auth state is updated
        }
      } catch (err) {
        // Why catch: If redirect() throws (which it does), we catch it here.
        // If it's the redirect error, ignore it (that's expected behavior).
        // If it's another error, handle it.
        
        if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
          // This is expected - redirect() throws this error to stop execution
          return
        }
        
        console.error('Unexpected error:', err)
        setError('An unexpected error occurred. Please try again.')
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Sign in to Street Style
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/register" className="font-medium text-black hover:underline">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isPending}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isPending}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}