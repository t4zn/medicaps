'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ProfilePicture } from '@/components/ui/profile-picture'
import { UserRole, getRoleDisplayName, getRoleBadgeColor, canManageUsers, getUserRole } from '@/lib/roles'
import { canManageUsersFallback } from '@/lib/roles-fallback'
import { LuSearch, LuUsers, LuShield, LuCheck, LuX } from 'react-icons/lu'

interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  role: UserRole | string
  created_at: string
  last_sign_in_at?: string | null
}

export function UserManagement() {
  const { profile } = useAuth()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Check if current user can manage users (with fallback)
  const canManage = profile ? (
    canManageUsers(profile.email || '', profile.role) || 
    canManageUsersFallback(profile.email || '')
  ) : false

  useEffect(() => {
    if (canManage) {
      fetchUsers()
    }
  }, [canManage])

  const fetchUsers = async () => {
    try {
      // First check if we can access the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, role, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        setUsers([])
        setMessage({ type: 'error', text: `Database error: ${error.message}` })
        return
      }

      // Ensure role field exists and apply hardcoded owner logic
      const usersWithRoles = (data || []).map(user => ({
        ...user,
        role: getUserRole(user.email || '', user.role || 'user'),
        last_sign_in_at: null // This field might not exist in all setups
      }))

      setUsers(usersWithRoles)
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([]) // Set empty array on error
      setMessage({ type: 'error', text: 'Failed to fetch users. Please check database setup.' })
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))

      setMessage({ type: 'success', text: 'User role updated successfully' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error updating user role:', error)
      setMessage({ type: 'error', text: 'Failed to update user role' })
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  if (!canManage) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <LuShield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">You don&apos;t have permission to manage users.</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LuUsers className="h-5 w-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole | 'all')}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="uploader">Uploader</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Message */}
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              {message.type === 'success' ? (
                <LuCheck className="h-4 w-4" />
              ) : (
                <LuX className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <LuUsers className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="border rounded-lg">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden p-3">
                    <div className="flex items-start gap-3 mb-3">
                      <ProfilePicture 
                        avatarUrl={user.avatar_url} 
                        fullName={user.full_name} 
                        userId={user.id}
                        size={32} 
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{user.full_name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge className={`${getRoleBadgeColor(user.role as UserRole)} text-xs`}>
                        {getRoleDisplayName(user.role as UserRole)}
                      </Badge>
                      
                      {/* Only allow role changes if not changing own role and not changing owner role */}
                      {user.id !== profile?.id && user.role !== 'owner' && (
                        <Select
                          value={user.role}
                          onValueChange={(newRole: UserRole) => updateUserRole(user.id, newRole)}
                        >
                          <SelectTrigger className="w-24 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="uploader">Uploader</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex sm:items-center sm:justify-between sm:p-4">
                    <div className="flex items-center gap-4">
                      <ProfilePicture 
                        avatarUrl={user.avatar_url} 
                        fullName={user.full_name} 
                        userId={user.id}
                        size={40} 
                      />
                      <div>
                        <h3 className="font-medium">{user.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getRoleBadgeColor(user.role as UserRole)}>
                        {getRoleDisplayName(user.role as UserRole)}
                      </Badge>
                      
                      {/* Only allow role changes if not changing own role and not changing owner role */}
                      {user.id !== profile?.id && user.role !== 'owner' && (
                        <Select
                          value={user.role}
                          onValueChange={(newRole: UserRole) => updateUserRole(user.id, newRole)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="uploader">Uploader</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}