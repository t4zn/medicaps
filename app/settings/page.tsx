'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import MyUploads from '@/components/profile/MyUploads'
import AdminPanel from '@/components/admin/AdminPanel'
import SavedResources from '@/components/profile/SavedResources'
import { RoleRequest } from '@/components/profile/RoleRequest'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { 
  LuUser, 
  LuFileText, 
  LuBookmark, 
  LuShield, 
  LuSettings, 
  LuCheck,
  LuLogOut,
  LuChevronLeft
} from 'react-icons/lu'

// Predefined avatars
const PREDEFINED_AVATARS = [
  '/avatars/boy.PNG',
  '/avatars/boy1.PNG', 
  '/avatars/boy2.PNG',
  '/avatars/girl.PNG',
  '/avatars/girl1.PNG',
  '/avatars/girl3.PNG',
]

type SettingsSection = 'profile' | 'uploads' | 'saved' | 'roles' | 'admin' | 'overview'

export default function SettingsPage() {
  const { user, loading, profile, userRole, hasPermission, signOut } = useAuth()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')
  const [profileLoading, setProfileLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar_url || PREDEFINED_AVATARS[0])
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
  })
  
  // Check if user can access admin panel
  const canAccessAdmin = hasPermission('canAccessAdminPanel')
  
  // Mobile responsive logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { // lg breakpoint
        if (activeSection !== 'overview' && activeSection === 'profile') {
          setActiveSection('overview')
        }
      }
    }
    
    // Set initial state
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile) {
      setFormData({ full_name: profile.full_name || '' })
      setSelectedAvatar(profile.avatar_url || PREDEFINED_AVATARS[0])
    }
  }, [profile])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setProfileLoading(true)
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
      setProfileLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }



  const getSectionTitle = (section: SettingsSection) => {
    switch (section) {
      case 'profile': return 'Account'
      case 'uploads': return 'My Uploads'
      case 'saved': return 'Saved Resources'
      case 'roles': return 'Role Requests'
      case 'admin': return 'Admin Panel'
      default: return 'Settings'
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="space-y-0">
              <button
                onClick={() => setActiveSection('profile')}
                className="py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left group w-full"
              >
                <div className="flex items-center gap-3 mb-2">
                  <LuUser className="h-4 w-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  <span className="font-light text-black dark:text-white">Account</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Update your profile and avatar
                </p>
              </button>

              <div className="border-b border-gray-200 dark:border-gray-800"></div>

              <button
                onClick={() => setActiveSection('uploads')}
                className="py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left group w-full"
              >
                <div className="flex items-center gap-3 mb-2">
                  <LuFileText className="h-4 w-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  <span className="font-light text-black dark:text-white">My Uploads</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View and manage your uploaded files
                </p>
              </button>

              <div className="border-b border-gray-200 dark:border-gray-800"></div>

              <button
                onClick={() => setActiveSection('saved')}
                className="py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left group w-full"
              >
                <div className="flex items-center gap-3 mb-2">
                  <LuBookmark className="h-4 w-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  <span className="font-light text-black dark:text-white">Saved Resources</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Access your bookmarked content
                </p>
              </button>

              <div className="border-b border-gray-200 dark:border-gray-800"></div>

              <button
                onClick={() => setActiveSection('roles')}
                className="py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left group w-full"
              >
                <div className="flex items-center gap-3 mb-2">
                  <LuShield className="h-4 w-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                  <span className="font-light text-black dark:text-white">Role Requests</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Request role upgrades
                </p>
              </button>

              {canAccessAdmin && (
                <>
                  <div className="border-b border-gray-200 dark:border-gray-800"></div>
                  
                  <button
                    onClick={() => setActiveSection('admin')}
                    className="py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left group w-full"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <LuSettings className="h-4 w-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                      <span className="font-light text-black dark:text-white">Admin Panel</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Manage users and content
                    </p>
                  </button>
                </>
              )}
            </div>
          </div>
        )
      case 'profile':
        return (
          <div className="max-w-md mx-auto space-y-8">
            {/* Profile Picture Section */}
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
              
              <div>
                <Input
                  value={user.email || ''}
                  disabled
                  className="text-center border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent text-gray-500 dark:text-gray-400"
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
                disabled={profileLoading}
                className="w-full bg-black dark:bg-white text-white dark:text-black hover:opacity-80 active:opacity-60"
              >
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>

            {/* Sign Out */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                onClick={() => signOut()}
                className="w-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                <LuLogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        )
      case 'uploads':
        return <MyUploads />
      case 'saved':
        return <SavedResources />
      case 'roles':
        return <RoleRequest />
      case 'admin':
        return <AdminPanel />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-light text-black dark:text-white mb-8">Settings</h1>
          
          {/* General Settings */}
          <div className="mb-8">
            <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              General Settings
            </h2>
            <div className="space-y-1">
              <button
                onClick={() => setActiveSection('profile')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  activeSection === 'profile'
                    ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <LuUser className="h-4 w-4" />
                Account
              </button>
              
              <button
                onClick={() => setActiveSection('uploads')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  activeSection === 'uploads'
                    ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <LuFileText className="h-4 w-4" />
                My Uploads
              </button>
              
              <button
                onClick={() => setActiveSection('saved')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  activeSection === 'saved'
                    ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <LuBookmark className="h-4 w-4" />
                Saved Resources
              </button>
            </div>
          </div>

          {/* User Settings */}
          <div className="mb-8">
            <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              User Settings
            </h2>
            <div className="space-y-1">
              <button
                onClick={() => setActiveSection('roles')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  activeSection === 'roles'
                    ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <LuShield className="h-4 w-4" />
                Role Requests
              </button>
            </div>
          </div>

          {/* Admin Settings */}
          {canAccessAdmin && (
            <div>
              <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Admin Settings
              </h2>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveSection('admin')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                    activeSection === 'admin'
                      ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <LuSettings className="h-4 w-4" />
                  Admin Panel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Navigation */}
        <div className="lg:hidden border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3 mb-4">
            {activeSection !== 'overview' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveSection('overview')}
                className="text-gray-500 hover:text-black dark:hover:text-white p-1"
              >
                <LuChevronLeft className="h-5 w-5" />
              </Button>
            )}
            
            <h1 className="text-xl font-light text-black dark:text-white">
              {activeSection === 'overview' ? 'Settings' : getSectionTitle(activeSection)}
            </h1>
          </div>
        </div>

        <div className="p-4 lg:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}