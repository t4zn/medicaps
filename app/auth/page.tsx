'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoginForm from '@/components/auth/LoginForm'
import SignUpForm from '@/components/auth/SignUpForm'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light text-black dark:text-white mb-2">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {isLogin ? 'Sign in to your account' : 'Join MediNotes'}
          </p>
        </div>

        {isLogin ? (
          <LoginForm
            onSuccess={() => router.push('/')}
            onSwitchToSignUp={() => setIsLogin(false)}
          />
        ) : (
          <SignUpForm
            onSuccess={() => setIsLogin(true)}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  )
}