'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'
import { LuCamera, LuUser, LuMail, LuSave, LuUpload } from 'react-icons/lu'

export default function ProfileSettings() {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: user?.email || '',
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
        })
        .eq('id', user.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file.' })
      return
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 2MB.' })
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      // For now, we'll skip the avatar upload functionality
      // since the storage bucket needs to be set up in Supabase first
      setMessage({ 
        type: 'error', 
        text: 'Avatar upload is currently disabled. Please contact support to enable this feature.' 
      })
      return

      // TODO: Uncomment this when storage bucket is properly configured
      /*
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      setMessage({ type: 'success', text: 'Profile picture updated successfully!' })
      
      // Refresh the page to show new avatar
      window.location.reload()
      */
    } catch (error) {
      console.error('Error uploading avatar:', error)
      setMessage({ type: 'error', text: 'Failed to upload profile picture. Please try again.' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Info */}
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <LuUser className="h-8 w-8 text-primary" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">{profile?.full_name || 'User'}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {profile?.role || 'Student'} • Member since {profile?.created_at 
                ? new Date(profile.created_at).toLocaleDateString()
                : 'N/A'
              }
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              placeholder="Enter your full name"
            />
          </div>

          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={loading}>
            <LuSave className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}