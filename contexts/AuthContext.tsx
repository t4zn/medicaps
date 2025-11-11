'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { UserRole, getUserRole, hasPermission, RolePermissions } from '@/lib/roles'

interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  phone?: string
  bio?: string
  program?: string
  year?: string
  branch?: string
  college?: string
  city?: string
  state?: string
  date_of_birth?: string
  gender?: string
  role?: string
  created_at: string
  updated_at?: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  userRole: UserRole
  isAdmin: boolean
  hasPermission: (permission: keyof RolePermissions) => boolean
  signIn: (email: string, password: string) => Promise<{ data: any; error: AuthError | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ data: any; error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ data: any; error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Get user role
  const userRole = getUserRole(profile?.email || '', profile?.role)
  
  // Check if user is admin (owner or admin role)
  const isAdmin = userRole === 'owner' || userRole === 'admin'
  
  // Permission checker function
  const checkPermission = (permission: keyof RolePermissions): boolean => {
    return hasPermission(profile?.email || '', profile?.role, permission)
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  }

  const value = {
    user,
    profile,
    loading,
    userRole,
    isAdmin,
    hasPermission: checkPermission,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}