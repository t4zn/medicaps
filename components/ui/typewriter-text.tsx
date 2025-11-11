'use client'

import { useState, useEffect } from 'react'
import { MarkdownWithActions } from '@/components/ui/markdown-with-actions'

interface TypewriterTextProps {
  text: string
  messageId: string
  onLike: (messageId: string) => void
  onDislike: (messageId: string) => void
  speed?: number
  onComplete?: () => void
}

export function TypewriterText({ 
  text, 
  messageId, 
  onLike, 
  onDislike, 
  speed = 30, 
  onComplete 
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (text.length === 0) {
      setIsComplete(true)
      onComplete?.()
      return
    }

    let currentIndex = 0
    setDisplayedText('')
    setIsComplete(false)

    const typeInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
        
        // Trigger scroll every few characters to keep up with typing
        if (currentIndex % 10 === 0) {
          // Dispatch a custom event to trigger scroll
          window.dispatchEvent(new CustomEvent('typewriter-progress'))
        }
      } else {
        setIsComplete(true)
        onComplete?.()
        clearInterval(typeInterval)
      }
    }, speed)

    return () => clearInterval(typeInterval)
  }, [text, speed, onComplete])

  return (
    <MarkdownWithActions
      messageId={messageId}
      onLike={onLike}
      onDislike={onDislike}
    >
      {displayedText}
    </MarkdownWithActions>
  )
}