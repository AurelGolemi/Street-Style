'use client'

import { signOut } from '@/app/actions/auth'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface UserDropdownProps {
  user: {
    id?: string
    email?: string
    user_metadata?: {
      full_name?: string
    }
  }
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Account'

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition"
        aria-expanded={isOpen}
        aria-label="User menu"
      >
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm font-bold">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium hidden sm:block">{displayName}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-xs text-gray-500">Signed in as</p>
              <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
            </div>
            
            <Link 
              href="/account" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
              onClick={() => setIsOpen(false)}
            >
              My Account
            </Link>
            <Link 
              href="/orders" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
              onClick={() => setIsOpen(false)}
            >
              Orders
            </Link>
            
            <hr className="my-1" />
            
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition disabled:opacity-50"
            >
              {isLoading ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}