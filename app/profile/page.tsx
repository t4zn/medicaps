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
    <div className="container mx-auto py-4 sm:py-8 px-4 max-w-6xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Manage your account, settings, and uploads
        </p>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-12 sm:h-10">
          <TabsTrigger value="settings" className="text-sm sm:text-base">
            <LuUser className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Settings</span>
            <span className="xs:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="uploads" className="text-sm sm:text-base">
            <LuFileText className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">My Uploads</span>
            <span className="xs:hidden">Files</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="mt-6">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="uploads" className="mt-6">
          <MyUploads />
        </TabsContent>
      </Tabs>
    </div>
  )
}