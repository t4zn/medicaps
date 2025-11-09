'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ProfileSettings from '@/components/profile/ProfileSettings'
import MyUploads from '@/components/profile/MyUploads'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LuUser, LuFileText } from 'react-icons/lu'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account and uploads
        </p>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">
            <LuUser className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="uploads">
            <LuFileText className="h-4 w-4 mr-2" />
            My Uploads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="uploads">
          <MyUploads />
        </TabsContent>
      </Tabs>
    </div>
  )
}