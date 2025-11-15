'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ProfilePicture } from '@/components/ui/profile-picture'
import { Pagination } from '@/components/ui/pagination'
import { UserRole, getRoleDisplayName, getRoleBadgeColor, canManageUsers, getUserRole } from '@/lib/roles'
import { canManageUsersFallback } from '@/lib/roles-fallback'
import { LuSearch, LuUsers, LuShield } from 'react-icons/lu'

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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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
      const response = await fetch('/api/admin/update-user-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          newRole,
          adminUserId: profile?.id
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update user role')
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))

      setMessage({ type: 'success', text: 'User role updated successfully' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error updating user role:', error)
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to update user role' 
      })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    return matchesSearch && matchesRole
  })
  
  // Pagination helpers
  const getPaginatedItems = <T,>(items: T[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return items.slice(startIndex, endIndex)
  }

  const getTotalPages = (totalItems: number) => {
    return Math.ceil(totalItems / itemsPerPage)
  }
  
  const paginatedUsers = getPaginatedItems(filteredUsers, currentPage)
  const totalPages = getTotalPages(filteredUsers.length)
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedRole])

  if (!canManage) {
    return (
      <div className="text-center py-12 space-y-4">
        <LuShield className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
        <div>
          <h3 className="text-lg font-light text-black dark:text-white mb-2">Access Denied</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">You don&apos;t have permission to manage users</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-0">
      <div>
        <h2 className="text-lg font-light text-black dark:text-white mb-6">User Management</h2>
      </div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent focus:border-black dark:focus:border-white focus:ring-0"
          />
        </div>
        <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole | 'all')}>
          <SelectTrigger className="w-full sm:w-48 border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent focus:border-black dark:focus:border-white">
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
        <div className={`text-center text-sm ${
          message.type === 'error' 
            ? 'text-red-600 dark:text-red-400' 
            : 'text-green-600 dark:text-green-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <LuUsers className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
            <div>
              <h3 className="text-lg font-light text-black dark:text-white mb-2">No users found</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <p className="text-gray-500 dark:text-gray-400 text-sm">{filteredUsers.length} users</p>
            </div>
            {paginatedUsers.map((user) => (
              <div key={user.id} className="py-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <ProfilePicture 
                      avatarUrl={user.avatar_url} 
                      fullName={user.full_name} 
                      userId={user.id}
                      size={40} 
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-black dark:text-white truncate">{user.full_name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getRoleBadgeColor(user.role as UserRole)}`}>
                      {getRoleDisplayName(user.role as UserRole)}
                    </span>
                    
                    {/* Only allow role changes if not changing own role and not changing owner role */}
                    {user.id !== profile?.id && user.role !== 'owner' && (
                      <Select
                        value={user.role}
                        onValueChange={(newRole: UserRole) => updateUserRole(user.id, newRole)}
                      >
                        <SelectTrigger className="w-24 sm:w-32 border-0 border-b border-gray-200 dark:border-gray-700 rounded-none bg-transparent focus:border-black dark:focus:border-white text-xs">
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
              </div>
            ))}
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-6"
            />
          </>
        )}
      </div>
    </div>
  )
}