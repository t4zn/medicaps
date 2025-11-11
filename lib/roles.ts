// Role-based permission system
export type UserRole = 'owner' | 'admin' | 'moderator' | 'uploader' | 'user'

export interface RolePermissions {
  canUploadWithoutApproval: boolean
  canDeleteFiles: boolean
  canManageUsers: boolean
  canAccessAdminPanel: boolean
  canModerateContent: boolean
  canManageSubjectRequests: boolean
}

// Hardcoded owner emails
const OWNER_EMAILS = ['taizun8@gmail.com', 'tzkaptan53@gmail.com']

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  owner: {
    canUploadWithoutApproval: true,
    canDeleteFiles: true,
    canManageUsers: true,
    canAccessAdminPanel: true,
    canModerateContent: true,
    canManageSubjectRequests: true,
  },
  admin: {
    canUploadWithoutApproval: true,
    canDeleteFiles: true,
    canManageUsers: true,
    canAccessAdminPanel: true,
    canModerateContent: true,
    canManageSubjectRequests: true,
  },
  moderator: {
    canUploadWithoutApproval: true,
    canDeleteFiles: true,
    canManageUsers: false,
    canAccessAdminPanel: true,
    canModerateContent: true,
    canManageSubjectRequests: true,
  },
  uploader: {
    canUploadWithoutApproval: true,
    canDeleteFiles: false,
    canManageUsers: false,
    canAccessAdminPanel: false,
    canModerateContent: false,
    canManageSubjectRequests: false,
  },
  user: {
    canUploadWithoutApproval: false,
    canDeleteFiles: false,
    canManageUsers: false,
    canAccessAdminPanel: false,
    canModerateContent: false,
    canManageSubjectRequests: false,
  },
}

export function getUserRole(email: string, dbRole?: UserRole | string): UserRole {
  // Check if user is hardcoded owner
  if (email && OWNER_EMAILS.includes(email.toLowerCase())) {
    return 'owner'
  }
  
  // Validate and return database role or default to 'user'
  if (dbRole && ['owner', 'admin', 'moderator', 'uploader', 'user'].includes(dbRole as string)) {
    return dbRole as UserRole
  }
  
  return 'user'
}

export function hasPermission(
  userEmail: string, 
  dbRole: UserRole | string | undefined, 
  permission: keyof RolePermissions
): boolean {
  if (!userEmail) return false
  
  const role = getUserRole(userEmail, dbRole)
  const rolePermissions = ROLE_PERMISSIONS[role]
  if (!rolePermissions) {
    return false
  }
  return rolePermissions[permission]
}

export function canUploadWithoutApproval(userEmail: string, dbRole?: UserRole | string): boolean {
  return hasPermission(userEmail, dbRole, 'canUploadWithoutApproval')
}

export function canDeleteFiles(userEmail: string, dbRole?: UserRole | string): boolean {
  return hasPermission(userEmail, dbRole, 'canDeleteFiles')
}

export function canAccessAdminPanel(userEmail: string, dbRole?: UserRole | string): boolean {
  return hasPermission(userEmail, dbRole, 'canAccessAdminPanel')
}

export function canManageUsers(userEmail: string, dbRole?: UserRole | string): boolean {
  return hasPermission(userEmail, dbRole, 'canManageUsers')
}

export function canModerateContent(userEmail: string, dbRole?: UserRole | string): boolean {
  return hasPermission(userEmail, dbRole, 'canModerateContent')
}

export function canManageSubjectRequests(userEmail: string, dbRole?: UserRole | string): boolean {
  return hasPermission(userEmail, dbRole, 'canManageSubjectRequests')
}

export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    owner: 'Owner',
    admin: 'Administrator',
    moderator: 'Moderator',
    uploader: 'Uploader',
    user: 'User',
  }
  return roleNames[role]
}

export function getRoleBadgeColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    owner: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    moderator: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    uploader: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    user: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  }
  return colors[role]
}