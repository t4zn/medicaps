'use client'

import Image from 'next/image'

interface ProfilePictureProps {
  avatarUrl?: string | null
  fullName?: string
  size?: number
  className?: string
}

export function ProfilePicture({ 
  avatarUrl, 
  fullName, 
  size = 24, 
  className = '' 
}: ProfilePictureProps) {
  const initials = fullName 
    ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) 
    : 'U'
  
  if (avatarUrl) {
    return (
      <div 
        className={`rounded-full overflow-hidden flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={avatarUrl}
          alt={fullName || 'User'}
          width={size}
          height={size}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }
  
  return (
    <div 
      className={`rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  )
}