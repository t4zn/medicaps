'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ProfileSettings from '@/components/profile/ProfileSettings'
import MyUploads from '@/components/profile/MyUploads'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LuUser, LuFileText, LuShield, LuBookmark } from 'react-icons/lu'
import AdminPanel from '@/components/admin/AdminPanel'
import SavedResources from '@/components/profile/SavedResources'
import { RoleRequest } from '@/components/profile/RoleRequest'

export default function ProfilePage() {
  const { user, loading, profile, userRole, hasPermission } = useAuth()
  const router = useRouter()
  
  // Check if user can access admin panel (only owners and admins)
  const canAccessAdmin = hasPermission('canAccessAdminPanel')

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Profile</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your account, settings, and uploads
            </p>
          </div>
          {profile && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Your Role</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                userRole === 'owner' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                userRole === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                userRole === 'moderator' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                userRole === 'uploader' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
              }`}>
                {userRole === 'owner' ? 'Owner' :
                 userRole === 'admin' ? 'Administrator' :
                 userRole === 'moderator' ? 'Moderator' :
                 userRole === 'uploader' ? 'Uploader' : 'User'}
              </span>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <div className="w-full overflow-x-auto">
          <TabsList className={`flex w-max min-w-full h-12 sm:h-10 ${canAccessAdmin ? 'sm:grid-cols-5' : 'sm:grid-cols-4'} sm:grid sm:w-full`}>
          <TabsTrigger value="settings" className="text-sm sm:text-base whitespace-nowrap px-3 sm:px-4">
            <LuUser className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Settings</span>
            <span className="xs:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="uploads" className="text-sm sm:text-base whitespace-nowrap px-3 sm:px-4">
            <LuFileText className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">My Uploads</span>
            <span className="xs:hidden">Files</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="text-sm sm:text-base whitespace-nowrap px-3 sm:px-4">
            <LuBookmark className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Saved</span>
            <span className="xs:hidden">Saved</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="text-sm sm:text-base whitespace-nowrap px-3 sm:px-4">
            <LuShield className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Roles</span>
            <span className="xs:hidden">Roles</span>
          </TabsTrigger>
          {canAccessAdmin && (
            <TabsTrigger value="admin" className="text-sm sm:text-base whitespace-nowrap px-3 sm:px-4">
              <LuShield className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Admin</span>
              <span className="xs:hidden">Admin</span>
            </TabsTrigger>
          )}
        </TabsList>
        </div>

        <TabsContent value="settings" className="mt-6">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="uploads" className="mt-6">
          <MyUploads />
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <SavedResources />
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <RoleRequest />
        </TabsContent>

        {canAccessAdmin && (
          <TabsContent value="admin" className="mt-6">
            <AdminPanel />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}