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
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto">
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