'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '../ui/label'
import { Alert, AlertDescription } from '../ui/alert'
import { LuSave, LuPlus, LuCheck } from 'react-icons/lu'
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
    <div className="max-w-md mx-auto space-y-6">
      {/* Profile Picture Selection */}
      <div className="text-center">
        <div className="mb-4">
          <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 mx-auto">
            <Image
              src={selectedAvatar}
              alt="Profile"
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-medium mb-3 block">Choose Avatar</Label>
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            {PREDEFINED_AVATARS.map((avatar, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedAvatar(avatar)}
                className={`relative h-16 w-16 rounded-full overflow-hidden border-2 transition-all ${
                  selectedAvatar === avatar 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
                {selectedAvatar === avatar && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <LuCheck className="h-4 w-4 text-primary" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Name Form */}
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <Label htmlFor="full_name" className="text-sm font-medium">
            Full Name
          </Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="Enter your full name"
            required
            className="mt-1"
          />
        </div>

        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription className="text-sm">{message.text}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          <LuSave className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>

      {/* Quick Actions */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/settings/subject-requests">
              <LuPlus className="h-4 w-4 mr-2" />
              Request New Subject
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}