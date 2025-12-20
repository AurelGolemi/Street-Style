'use client'

import { useState, useTransition } from 'react'
import { updatePassword } from '@/app/actions/profile'

export default function PasswordForm() {
  // Why separate state for each field: Need to validate password match
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Client-side validation
    // Why validate length: Enforce security standards before hitting server
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // Why check match: Prevent typos. User must confirm intentional change.
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    startTransition(async () => {
      const result = await updatePassword(newPassword)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('Password updated successfully!')
        // Why clear fields: Security best practice. Don't leave passwords visible.
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => setSuccess(null), 3000)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isPending}
          minLength={6}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black disabled:opacity-50"
        />
        {/* Why minLength attribute: HTML5 validation provides immediate
            feedback before form submission. */}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Your Password</label>
    <input
id="confirmPassword"
type="password"
value={confirmPassword}
onChange={(e) => setConfirmPassword(e.target.value)}
disabled={isPending}
minLength={6}
required
className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black disabled:opacity-50"
/>
</div>
  <button
    type="submit"
    disabled={isPending}
    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
    {isPending ? 'Updating...' : 'Update Password'}
  </button>
</form>
)
}