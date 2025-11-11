'use client'

import { useState, useRef, useEffect } from 'react'
import { LuBot, LuLoader, LuMic, LuMicOff, LuTrash2 } from 'react-icons/lu'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/contexts/AuthContext'
import { MarkdownWithActions } from '@/components/ui/markdown-with-actions'

// Type definitions for Speech Recognition API
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult
  length: number
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative
  length: number
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}



interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface SubjectChatProps {
  subject: {
    name: string
    program: string
    year: string
    code?: string
  }
}

export default function SubjectChat({ subject }: SubjectChatProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Initialize messages on client side to avoid hydration mismatch
  useEffect(() => {
    if (!isInitialized && user) {
      const chatKey = `ai-chat-${subject.program}-${subject.year}-${subject.name.toLowerCase().replace(/\s+/g, '-')}`
      
      // Try to load existing conversation from localStorage
      const savedMessages = localStorage.getItem(chatKey)
      
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages).map((msg: Message & { timestamp: string }) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          setMessages(parsedMessages)
        } catch (error) {
          console.error('Error parsing saved messages:', error)
          // Fall back to default message
          setMessages([
            {
              id: '1',
              content: `Hi! I'm your AI tutor for ${subject.name}. I can help you with concepts, solve problems, explain topics, and answer questions related to this subject. What would you like to learn about today?`,
              role: 'assistant',
              timestamp: new Date()
            }
          ])
        }
      } else {
        // No saved conversation, start with default message
        setMessages([
          {
            id: '1',
            content: `Hi! I'm your AI tutor for ${subject.name}. I can help you with concepts, solve problems, explain topics, and answer questions related to this subject. What would you like to learn about today?`,
            role: 'assistant',
            timestamp: new Date()
          }
        ])
      }
      setIsInitialized(true)
    }
  }, [subject.name, subject.program, subject.year, isInitialized, user])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result: SpeechRecognitionResult) => result[0])
          .map((result: SpeechRecognitionAlternative) => result.transcript)
          .join('')
        
        setInput(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }
    }
  }, [])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current && scrollAreaRef.current) {
        // Find the viewport element within the ScrollArea
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
        if (viewport) {
          // Scroll the viewport to the bottom smoothly
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: 'smooth'
          })
        }
      }
    }

    // Use a small delay to ensure DOM has updated
    const timeoutId = setTimeout(scrollToBottom, 100)
    
    return () => clearTimeout(timeoutId)
  }, [messages, isLoading])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (isInitialized && user && messages.length > 0) {
      const chatKey = `ai-chat-${subject.program}-${subject.year}-${subject.name.toLowerCase().replace(/\s+/g, '-')}`
      localStorage.setItem(chatKey, JSON.stringify(messages))
    }
  }, [messages, isInitialized, user, subject.program, subject.year, subject.name])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!input.trim() || isLoading || !user) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    
    // Reset textarea height when input is cleared
    if (inputRef.current) {
      inputRef.current.style.height = '24px'
    }
    
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          subject: {
            name: subject.name,
            program: subject.program,
            year: subject.year,
            code: subject.code
          },
          userId: user.id
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    
    // Reset height to auto to get the correct scrollHeight
    e.target.style.height = 'auto'
    
    // Calculate height based on content
    const scrollHeight = e.target.scrollHeight
    const lineHeight = 24 // Approximate line height
    const minHeight = lineHeight // Single line
    const maxHeight = lineHeight * 5 // 5 lines max
    
    // Ensure minimum expansion is visible
    const contentHeight = Math.max(scrollHeight, minHeight)
    const newHeight = Math.min(contentHeight, maxHeight)
    
    e.target.style.height = `${newHeight}px`
  }

  const toggleVoiceRecording = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const handleLike = (messageId: string) => {
    console.log('Liked message:', messageId)
    // You can implement analytics or feedback storage here
  }

  const handleDislike = (messageId: string) => {
    console.log('Disliked message:', messageId)
    // You can implement analytics or feedback storage here
  }

  const clearChat = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (confirm('Are you sure you want to clear the chat? This action cannot be undone.')) {
      const initialMessage: Message = {
        id: '1',
        content: `Hi! I'm your AI tutor for ${subject.name}. I can help you with concepts, solve problems, explain topics, and answer questions related to this subject. What would you like to learn about today?`,
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages([initialMessage])
      
      // Clear from localStorage
      const chatKey = `ai-chat-${subject.program}-${subject.year}-${subject.name.toLowerCase().replace(/\s+/g, '-')}`
      localStorage.removeItem(chatKey)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <LuBot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">AI Tutor Available</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Sign in to chat with your AI tutor for {subject.name}. Get instant help with concepts, problems, and study guidance.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative flex flex-col h-[500px] sm:h-[600px]">
      {/* Header with Clear Button */}
      <div className="flex justify-end p-3 border-b border-border/50">
        <button
          type="button"
          onClick={(e) => clearChat(e)}
          disabled={messages.length <= 1}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Clear chat history"
        >
          <LuTrash2 className="h-3 w-3" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-3 sm:px-2 py-4 pb-32" ref={scrollAreaRef}>
        <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">

              
              <div className={`${message.role === 'user' ? 'flex justify-end' : ''}`}>
                <div
                  className={`text-xs sm:text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-muted/70 rounded-lg px-3 py-2 sm:px-4 sm:py-3 max-w-[85%] sm:max-w-[80%] w-fit'
                      : 'text-foreground'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <MarkdownWithActions
                      messageId={message.id}
                      onLike={handleLike}
                      onDislike={handleDislike}
                    >
                      {message.content}
                    </MarkdownWithActions>
                  ) : (
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LuLoader className="h-3 w-3 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
          
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </ScrollArea>

      {/* Floating Input */}
      <div className="absolute bottom-6 left-4 right-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="bg-muted/40 rounded-3xl px-4 py-3 sm:px-5 sm:py-3 border border-border/50 shadow-lg transition-all duration-200">
              {/* Text Area */}
              <div className="mb-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  className="w-full resize-none bg-transparent text-sm sm:text-base placeholder:text-sm placeholder:sm:text-base placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 border-0 p-0 leading-6 overflow-y-auto scrollbar-hide"
                  rows={1}
                  disabled={isLoading}
                  style={{ 
                    height: '24px',
                    minHeight: '24px',
                    maxHeight: '120px',
                    lineHeight: '24px'
                  }}
                />
              </div>
              
              {/* Buttons Row */}
              <div className="flex items-center justify-end gap-3">
                {/* Voice Recording Button */}
                <button
                  type="button"
                  onClick={(e) => toggleVoiceRecording(e)}
                  disabled={isLoading}
                  className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center flex-shrink-0 ${
                    isListening 
                      ? 'bg-red-500 text-white' 
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isListening ? (
                    <LuMicOff className="h-4 w-4" />
                  ) : (
                    <LuMic className="h-4 w-4" />
                  )}
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center flex-shrink-0 ${
                    input.trim() && !isLoading
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  <svg 
                    className="w-4 h-4" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}