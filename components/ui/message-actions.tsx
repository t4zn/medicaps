'use client'

import { useState } from 'react'
import { LuCopy, LuThumbsUp, LuThumbsDown, LuCheck } from 'react-icons/lu'

interface MessageActionsProps {
  messageId: string
  contentRef?: React.RefObject<HTMLDivElement | null>
  rawContent?: string
  onLike?: (messageId: string) => void
  onDislike?: (messageId: string) => void
}

export function MessageActions({ messageId, contentRef, rawContent, onLike, onDislike }: MessageActionsProps) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)

  const convertMarkdownToText = (markdown: string): string => {
    return markdown
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, (match) => {
        const lines = match.split('\n')
        return lines.slice(1, -1).join('\n')
      })
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      // Remove headers
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold/italic
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // Remove links but keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove list markers
      .replace(/^[\s]*[-*+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      // Clean up extra whitespace
      .replace(/\n\s*\n/g, '\n\n')
      .trim()
  }

  const handleCopy = async (event: React.MouseEvent) => {
    try {
      let textToCopy = ''
      
      // Method 1: Use the contentRef if available
      if (contentRef?.current) {
        const element = contentRef.current
        textToCopy = element.innerText || element.textContent || ''
      }
      
      // Method 2: Find the markdown content by traversing up from the button
      if (!textToCopy || textToCopy.length < 20) {
        const button = event.currentTarget as HTMLElement
        const messageContainer = button.closest('.w-full.min-w-0')
        const markdownContent = messageContainer?.querySelector('.markdown-content')
        
        if (markdownContent) {
          textToCopy = markdownContent.textContent || ''
        }
      }
      
      // Method 3: Convert raw markdown to plain text
      if (!textToCopy || textToCopy.length < 20) {
        textToCopy = rawContent ? convertMarkdownToText(rawContent) : ''
      }
      
      if (textToCopy && textToCopy.length > 0) {
        await navigator.clipboard.writeText(textToCopy)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (error) {
      console.error('Failed to copy text:', error)
      // Fallback: try to copy raw content
      if (rawContent) {
        try {
          await navigator.clipboard.writeText(rawContent)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch (fallbackError) {
          console.error('Fallback copy also failed:', fallbackError)
        }
      }
    }
  }

  const handleLike = () => {
    if (disliked) {
      setDisliked(false)
    }
    setLiked(!liked)
    onLike?.(messageId)
  }

  const handleDislike = () => {
    if (liked) {
      setLiked(false)
    }
    setDisliked(!disliked)
    onDislike?.(messageId)
  }

  return (
    <div className="flex items-center gap-2 mt-3 opacity-70 hover:opacity-100 transition-opacity">
      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="p-2 rounded-lg hover:bg-muted/60 transition-all duration-200 group border border-transparent hover:border-border/50"
        title="Copy message"
      >
        {copied ? (
          <LuCheck className="h-4 w-4 text-green-500" />
        ) : (
          <LuCopy className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
        )}
      </button>

      {/* Like Button */}
      <button
        onClick={handleLike}
        className="p-2 rounded-lg transition-all duration-200 group border border-transparent hover:border-border/50 hover:bg-muted/60"
        title="Like message"
      >
        <LuThumbsUp 
          className={`h-4 w-4 transition-colors ${
            liked 
              ? 'text-black dark:text-white' 
              : 'text-muted-foreground group-hover:text-foreground'
          }`} 
        />
      </button>

      {/* Dislike Button */}
      <button
        onClick={handleDislike}
        className="p-2 rounded-lg transition-all duration-200 group border border-transparent hover:border-border/50 hover:bg-muted/60"
        title="Dislike message"
      >
        <LuThumbsDown 
          className={`h-4 w-4 transition-colors ${
            disliked 
              ? 'text-black dark:text-white' 
              : 'text-muted-foreground group-hover:text-foreground'
          }`} 
        />
      </button>
    </div>
  )
}