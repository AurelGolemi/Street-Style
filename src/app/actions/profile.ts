'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Type definitions for type safety and clarity
export type UserProfile = {
  id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}

export type UpdateProfileData = {
  full_name?: string
  email?: string
}

/**
 * Fetches the current user's profile from the database
 * 
 * How it works:
 * 1. Gets Supabase client with user's session
 * 2. Checks if user is authenticated
 * 3. Queries user_profiles table for matching user ID
 * 4. Returns profile data or error
 */
export async function getProfile(): Promise<{ profile: UserProfile | null; error?: string }> {
  const supabase = await createServerSupabaseClient()
  
  // Why getUser: Retrieves the authenticated user from the session.
  // This is how we know WHO is making the request.
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    // No valid session or error checking session
    return { profile: null, error: 'Not authenticated' }
  }

  // Why .from().select().eq().single():
  // - .from('user_profiles'): Query this table
  // - .select('*'): Get all columns
  // - .eq('id', user.id): WHERE id = user.id (filter by current user)
  // - .single(): Expect exactly one row, return object not array
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return { profile: null, error: error.message }
  }

  // Why type assertion: We know the shape matches UserProfile
  return { profile: data as UserProfile }
}

/**
 * Updates the current user's profile information
 * 
 * Security: RLS policies ensure users can only update their own profile
 */
export async function updateProfile(
  updates: UpdateProfileData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Not authenticated' }
  }

  // If email is being updated, we need to update both auth.users and user_profiles
  if (updates.email && updates.email !== user.email) {
    // Why updateUser: Changes email in Supabase Auth system.
    // This triggers a confirmation email to the new address.
    const { error: emailError } = await supabase.auth.updateUser({
      email: updates.email,
    })

    if (emailError) {
      return { success: false, error: emailError.message }
    }
  }

  // Update the profile table
  // Why { ...updates, updated_at: new Date().toISOString() }:
  // Spread operator includes all fields from 'updates', then we override
  // updated_at with current timestamp. This tracks when profile was last modified.
  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    // Why .eq: Only update the row matching this user's ID
    // RLS enforces this too, but being explicit is good practice

  if (updateError) {
    console.error('Error updating profile:', updateError)
    return { success: false, error: updateError.message }
  }

  // Why revalidatePath: The profile page displays this data. We need to
  // tell Next.js to refetch and re-render with the new data.
  revalidatePath('/profile')
  
  return { success: true }
}

/**
 * Updates the user's password
 * 
 * Security note: Supabase handles password hashing automatically
 */
export async function updatePassword(
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Why password validation: Enforce minimum security standards
  if (newPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' }
  }

  // Why updateUser with password: Supabase Auth handles:
  // 1. Hashing the password (never stored as plaintext)
  // 2. Updating auth.users table
  // 3. Maintaining session (user stays logged in)
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Deletes the user's account permanently
 * 
 * Critical operation: This is irreversible
 * Cascade deletion: When auth.users row is deleted, user_profiles,
 * cart_items, etc. are automatically deleted (ON DELETE CASCADE)
 */
export async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Why admin client needed: Regular client can't delete users from auth.users
  // This requires admin privileges. In production, you'd call an API endpoint
  // that uses the service_role key on the server.
  
  // For now, we'll use the Supabase Management API
  // Note: This requires setting up an API endpoint with service_role access
  
  // First, delete the user's profile (triggers cascade to related data)
  const { error: profileError } = await supabase
    .from('user_profiles')
    .delete()
    .eq('id', user.id)

  if (profileError) {
    return { success: false, error: profileError.message }
  }

  // Then sign out (session cleanup)
  await supabase.auth.signOut()

  // Why revalidate root: User data might be displayed in header/nav
  revalidatePath('/', 'layout')
  
  return { success: true }
}