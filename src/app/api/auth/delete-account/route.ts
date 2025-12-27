// app/api/auth/delete-account/route.ts

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function DELETE() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    // Create admin client (requires service role key)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    // Delete user's data (cascade will handle some, but explicit is safer)
    await supabase.from('cart_items').delete().eq('user_id', user.id)
    await supabase.from('user_profiles').delete().eq('id', user.id)
    
    // Delete user from auth.users
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id)
    
    if (error) {
      console.error('User deletion error:', error)
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
    }
    
    // Sign out
    await supabase.auth.signOut()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Account deleted successfully' 
    })
    
  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}