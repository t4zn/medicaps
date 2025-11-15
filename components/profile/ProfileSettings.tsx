'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '../ui/label'
import { Alert, AlertDescription } from '../ui/alert'
import { LuSave, LuCheck } from 'react-icons/lu'
import Link from 'next/link'

// Predefined avatars from public/avatars directory
const PREDEFINED_AVATARS = [
  '/avatars/boy.PNG',
  '/avatars/boy1.PNG', 
  '/avatars/boy2.PNG',
  '/avatars/girl.PNG',
  '/avatars/girl1.PNG',
  '/avatars/girl3.PNG',
]

export default function ProfileSettings() {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar_url || PREDEFINED_AVATARS[0])
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
  })

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          avatar_url: selectedAvatar,
        })
        .eq('id', user.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      
      // Refresh the page to show new avatar
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
    } finally {
      setLoading(false)
    }
  }





  return (
    <div className="max-w-md space-y-8">
      {/* Profile Picture Selection */}
      <div className="text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden mx-auto">
          <Image
            src={selectedAvatar}
            alt="Profile"
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="grid grid-cols-6 gap-2 max-w-xs mx-auto">
          {PREDEFINED_AVATARS.map((avatar, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedAvatar(avatar)}
              className={`relative h-10 w-10 rounded-full overflow-hidden transition-all ${
                selectedAvatar === avatar 
                  ? 'ring-2 ring-black dark:ring-white' 
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={avatar}
                alt={`Avatar ${index + 1}`}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
              {selectedAvatar === avatar && (
                <div className="absolute inset-0 bg-black/20 dark:bg-white/20 flex items-center justify-center">
                  <LuCheck className="h-3 w-3 text-black dark:text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="Full name"
            required
            className="text-center border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent focus:border-black dark:focus:border-white focus:ring-0"
          />
        </div>

        {message && (
          <div className={`text-center text-sm ${
            message.type === 'error' 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-green-600 dark:text-green-400'
          }`}>
            {message.text}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-black dark:bg-white text-white dark:text-black hover:opacity-80 active:opacity-60"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>

      {/* More Settings Link */}
      <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/settings"
          className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
        >
          More Settings →
        </Link>
      </div>
    </div>
  )
}