// Temporary fallback for roles system when database has issues

const OWNER_EMAILS = ['taizun8@gmail.com', 'tzkaptan53@gmail.com', 'pathforge2025@gmail.com']

export function isOwnerEmail(email: string): boolean {
  return OWNER_EMAILS.includes(email?.toLowerCase() || '')
}

// Fallback permission checks that work even when database role system is broken
export function canAccessAdminPanelFallback(email: string): boolean {
  return isOwnerEmail(email)
}

export function canUploadWithoutApprovalFallback(email: string): boolean {
  return isOwnerEmail(email)
}

export function canDeleteFilesFallback(email: string): boolean {
  return isOwnerEmail(email)
}

export function canManageUsersFallback(email: string): boolean {
  return isOwnerEmail(email)
}