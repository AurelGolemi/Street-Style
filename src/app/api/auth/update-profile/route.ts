// app/api/auth/update-profile/route.ts

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const { firstName, lastName, phone } = await request.json()
    
    const { error } = await supabase
      .from('user_profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
      })
      .eq('id', user.id)
    
    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully' 
    })
    
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}