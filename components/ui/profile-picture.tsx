'use client'

import Image from 'next/image'

interface ProfilePictureProps {
  avatarUrl?: string | null
  fullName?: string
  userId?: string
  size?: number
  className?: string
}

// Predefined avatars from public/avatars directory
const PREDEFINED_AVATARS = [
  '/avatars/boy.PNG',
  '/avatars/boy1.PNG', 
  '/avatars/boy2.PNG',
  '/avatars/girl.PNG',
  '/avatars/girl1.PNG',
  '/avatars/girl3.PNG',
]

export function ProfilePicture({ 
  avatarUrl, 
  fullName, 
  userId,
  size = 24, 
  className = '' 
}: ProfilePictureProps) {

  
  // Generate a consistent avatar based on user ID or name
  const getAvatarUrl = () => {
    // If avatarUrl is provided and it's one of our predefined avatars, use it
    if (avatarUrl && PREDEFINED_AVATARS.includes(avatarUrl)) {
      return avatarUrl
    }
    
    // Otherwise, generate a consistent avatar based on user ID or name
    const identifier = userId || fullName || 'default'
    let hash = 0
    for (let i = 0; i < identifier.length; i++) {
      const char = identifier.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    const index = Math.abs(hash) % PREDEFINED_AVATARS.length
    return PREDEFINED_AVATARS[index]
  }

  const selectedAvatar = getAvatarUrl()
  
  return (
    <div 
      className={`rounded-full overflow-hidden flex-shrink-0 bg-gray-100 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={selectedAvatar}
        alt={fullName || 'User Avatar'}
        width={size}
        height={size}
        className="w-full h-full object-cover"
      />
    </div>
  )
}