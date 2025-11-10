'use client'

import { useRef } from 'react'
import { Markdown } from './markdown'
import { MessageActions } from './message-actions'

interface MarkdownWithActionsProps {
  children: string
  messageId?: string
  showActions?: boolean
  onLike?: (messageId: string) => void
  onDislike?: (messageId: string) => void
}

export function MarkdownWithActions({ 
  children, 
  messageId, 
  showActions = true,
  onLike,
  onDislike 
}: MarkdownWithActionsProps) {
  const contentRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="w-full min-w-0">
      <div ref={contentRef}>
        <Markdown>{children}</Markdown>
      </div>
      {showActions && messageId && (
        <MessageActions
          messageId={messageId}
          contentRef={contentRef}
          rawContent={children}
          onLike={onLike}
          onDislike={onDislike}
        />
      )}
    </div>
  )
}