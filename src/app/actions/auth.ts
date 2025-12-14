'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  try {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const full_name = formData.get('full_name') as string
    const phone_number = formData.get('phone_number') as string

    // Validate inputs
    if (!email || !password) {
      return { error: 'Email and password are required' }
    }

    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters' }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name || '',
          phone_number: phone_number || '',
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })

    if (error) {
      console.error('Signup error:', error)
      return { error: error.message }
    }

    // Check if email confirmation is required
    if (data?.user?.identities?.length === 0) {
      return { error: 'Email already registered' }
    }

    revalidatePath('/', 'layout')
    return { success: true, message: 'Check your email to confirm your account' }
  } catch (error) {
    console.error('Signup exception:', error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function signIn(formData: FormData) {
  try {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return { error: 'Email and password are required' }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Signin error:', error)
      return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error) {
    console.error('Signin exception:', error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function signOut() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
  } catch (error) {
    console.error('Signout error:', error)
    return { error: 'Failed to sign out' }
  }
}

export async function getUser() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Get user error:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Get user exception:', error)
    return null
  }
}

export async function resetPassword(email: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true, message: 'Check your email for password reset link' }
  } catch (error) {
    console.error('Reset password error:', error)
    return { error: 'An unexpected error occurred' }
  }
}