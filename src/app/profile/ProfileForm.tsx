'use client'

import { useState, useTransition } from 'react'
import { updateProfile, type UserProfile } from '@/app/actions/profile'

/**
 * ProfileForm - Client Component
 * 
 * Why Client Component:
 * - Needs interactivity (form state, validation)
 * - Uses hooks (useState, useTransition)
 * - Handles user input in real-time
 */
export default function ProfileForm({ profile }: { profile: UserProfile }) {
  // Why useState: Tracks form field values that user is editing
  const [fullName, setFullName] = useState(profile.full_name || '')
  const [email, setEmail] = useState(profile.email)
  
  // Why separate state for messages: Displays success/error feedback to user
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Why useTransition: Handles loading state for server action automatically
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Client-side validation
    // Why validate here: Immediate feedback, reduces unnecessary server calls
    if (!fullName.trim()) {
      setError('Name cannot be empty')
      return
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    startTransition(async () => {
      // Why check for changes: Don't update if nothing changed
      const hasChanges = 
        fullName !== (profile.full_name || '') ||
        email !== profile.email

      if (!hasChanges) {
        setError('No changes to save')
        return
      }

      // Call server action with updates
      const result = await updateProfile({
        full_name: fullName,
        email: email,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('Profile updated successfully!')
        // Why setTimeout: Auto-clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Message Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Success Message Display */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Full Name Input */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isPending}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black disabled:opacity-50"
        />
        {/* Why onChange with setFullName: Controlled component pattern.
            React manages the input value, giving us full control over validation,
            formatting, and synchronization with component state. */}
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black disabled:opacity-50"
        />
        <p className="mt-1 text-sm text-gray-500">
          Changing your email will require verification at the new address
        </p>
        {/* Why this note: Setting expectations. Email changes trigger
            confirmation emails, so user won't be confused. */}
      </div>

      {/* Account Creation Date (Read-Only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Member Since
        </label>
        <p className="mt-1 text-sm text-gray-900">
          {new Date(profile.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        {/* Why toLocaleDateString: Formats timestamp in user's locale.
            Parameters customize format (full month name, numeric day/year). */}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
