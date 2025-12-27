// app/api/auth/update-email/route.ts

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const { newEmail } = await request.json()
    
    // Validate email format
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    
    // Update email (Supabase will send verification email)
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    
    if (error) {
      console.error('Email update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Email update initiated. Please verify your new email.',
    })
    
  } catch (error) {
    console.error('Email update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}