// Temporary fallback for roles system when database has issues

const OWNER_EMAILS = ['taizun8@gmail.com', 'tzkaptan53@gmail.com', 'pathforge2025@gmail.com']
const ADMIN_EMAILS = ['admin@medinotes.live'] // Add admin emails here
const MODERATOR_EMAILS = ['moderator@medinotes.live'] // Add moderator emails here  
const UPLOADER_EMAILS = ['uploader@medinotes.live'] // Add uploader emails here

export function isOwnerEmail(email: string): boolean {
  return OWNER_EMAILS.includes(email?.toLowerCase() || '')
}

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email?.toLowerCase() || '')
}

export function isModeratorEmail(email: string): boolean {
  return MODERATOR_EMAILS.includes(email?.toLowerCase() || '')
}

export function isUploaderEmail(email: string): boolean {
  return UPLOADER_EMAILS.includes(email?.toLowerCase() || '')
}

// Fallback permission checks that work even when database role system is broken
export function canAccessAdminPanelFallback(email: string): boolean {
  return isOwnerEmail(email) || isAdminEmail(email) || isModeratorEmail(email)
}

export function canUploadWithoutApprovalFallback(email: string): boolean {
  return isOwnerEmail(email) || isAdminEmail(email) || isModeratorEmail(email) || isUploaderEmail(email)
}

export function canDeleteFilesFallback(email: string): boolean {
  return isOwnerEmail(email) || isAdminEmail(email) || isModeratorEmail(email)
}

export function canManageUsersFallback(email: string): boolean {
  return isOwnerEmail(email) || isAdminEmail(email)
}