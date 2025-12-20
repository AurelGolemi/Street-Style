'use client'

import { useState, useTransition } from 'react'
import { deleteAccount } from '@/app/actions/profile'
import { useRouter } from 'next/navigation'

export default function DeleteAccountButton() {
  // Why showConfirmation: Two-step process prevents accidental deletion
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function handleDelete() {
    setError(null)

    startTransition(async () => {
      const result = await deleteAccount()

      if (result.error) {
        setError(result.error)
        setShowConfirmation(false)
      } else {
        // Why router.push: Account deleted, redirect to home page
        router.push('/')
        router.refresh()
        // Why refresh: Ensures all components re-fetch data,
        // reflecting that user is no longer authenticated
      }
    })
  }

  if (!showConfirmation) {
    return (
      <button
        onClick={() => setShowConfirmation(true)}
        className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
      >
        Delete Account
      </button>
    )
  }

  // Confirmation UI
  return (
    <div className="border border-red-300 rounded-md p-4 bg-red-50">
      {error && (
        <div className="mb-4 text-red-700">
          {error}
        </div>
      )}
      
      <p className="text-sm font-medium text-red-800 mb-4">
        Are you absolutely sure? This action cannot be undone. This will permanently
        delete your account and remove all your data from our servers.
      </p>
      
      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Deleting...' : 'Yes, Delete My Account'}
        </button>
        
        <button
          onClick={() => setShowConfirmation(false)}
          disabled={isPending}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
      {/* Why two buttons: Clear primary/secondary actions.
          Destructive action (delete) is visually distinct (red).
          Cancel is less prominent (outline). */}
    </div>
  )
}