'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Type definitions for better type safety and IDE autocomplete
export type User = {
  id: string
  email: string
  // Add other user properties as needed
}

export type AuthResult = {
  error?: string
  success?: boolean
}

export async function getUser(): Promise<User | null> {
  try {
    const supabase = await createClient()
    
    // Why getUser() instead of getSession():
    // - getUser() makes an API call to verify the token is still valid
    // - getSession() only reads the local session without verification
    // - For security-critical operations, always use getUser()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error fetching user:', error.message)
      return null
    }
    
    if (!user || !user.email) {
      return null
    }
    
    // Return only the data we need to minimize payload
    return {
      id: user.id,
      email: user.email,
    }
  } catch (error) {
    // Catch any unexpected errors (network issues, etc.)
    console.error('Unexpected error in getUser:', error)
    return null
  }
}

// Signs in a user with an email and password
export async function signIn(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  // Validation: Check if required fields are present
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }
  
  console.log('Attempting sign in for:', email)
  
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    console.error('Sign in error:', error.message)
    return { error: error.message }
  }
  
  console.log('Sign in successful for user:', authData.user?.id)
  
  // Revalidate all pages to reflect new auth state
  revalidatePath('/', 'layout')
  
  // Redirect happens after function returns, so this works differently
  // than your original implementation
  redirect('/')
}

// Signs up a new user with an email and password
export async function signUp(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }
  
  // Password strength validation (basic example)
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }
  
  console.log('Attempting sign up for:', email)
  
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Email redirect URL after confirmation
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  
  if (error) {
    console.error('Sign up error:', error.message)
    return { error: error.message }
  }
  
  console.log('Sign up successful for user:', authData.user?.id)
  
  // Check if email confirmation is required
  if (authData.user && !authData.session) {
    return { 
      success: true,
      error: 'Please check your email to confirm your account'
    }
  }
  
  revalidatePath('/', 'layout')
  redirect('/')
}

// Signs out the current user
export async function signOut(): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Sign out error:', error.message)
    // Don't return error - still revalidate to clear cached user data
  }
  
  console.log('User signed out successfully')
  
  // Revalidate all pages to remove user-specific cached content
  revalidatePath('/', 'layout')
  
  // Redirect to home or login page
  redirect('/')
}

// Updates user password
export async function updatePassword(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()
  
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string
  
  if (!newPassword || !confirmPassword) {
    return { error: 'Both password fields are required' }
  }
  
  if (newPassword !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }
  
  if (newPassword.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  
  if (error) {
    console.error('Password update error:', error.message)
    return { error: error.message }
  }
  
  console.log('Password updated successfully')
  
  return { success: true }
}

// Sends a password reset email
export async function resetPassword(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  
  if (!email) {
    return { error: 'Email is required' }
  }
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })
  
  if (error) {
    console.error('Password reset error:', error.message)
    return { error: error.message }
  }
  
  console.log('Password reset email sent to:', email)
  
  return { 
    success: true,
    error: 'Check your email for the password reset link'
  }
}