import { getProfile } from '@/app/actions/profile'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'
import PasswordForm from './PasswordForm'
import DeleteAccountButton from './DeleteAccountButton'

/**
 * Profile Page - Server Component
 * 
 * Why Server Component: 
 * - Can directly call server actions (getProfile)
 * - Renders on server, reducing client JavaScript
 * - Better for SEO and initial page load
 */
export default async function ProfilePage() {
  // Why await: getProfile is async, fetches from database
  const { profile, error } = await getProfile()

  // Why redirect: If no profile (shouldn't happen after middleware),
  // send to login. Using redirect() in server component is safe.
  if (!profile) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Information Section */}
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Profile Information
          </h2>
          <ProfileForm profile={profile} />
        </div>

        {/* Password Change Section */}
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Change Password
          </h2>
          <PasswordForm />
        </div>

        {/* Danger Zone - Account Deletion */}
        <div className="bg-white shadow rounded-lg p-6 border-2 border-red-200">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Danger Zone
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. This action is permanent
            and will remove all your data including cart items and order history.
          </p>
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  )
}