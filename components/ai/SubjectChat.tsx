'use client'

import { useState, useRef, useEffect } from 'react'
import { LuBot, LuLoader, LuMic, LuMicOff } from 'react-icons/lu'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/contexts/AuthContext'

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

// Simple markdown parser for basic formatting
const parseMarkdown = (text: string) => {
  return text
    // Bold text **text** or __text__
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    // Italic text *text* or _text_
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Code `code`
    .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs">$1</code>')
    // Line breaks
    .replace(/\n/g, '<br>')
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

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (isInitialized && user && messages.length > 0) {
      const chatKey = `ai-chat-${subject.program}-${subject.year}-${subject.name.toLowerCase().replace(/\s+/g, '-')}`
      localStorage.setItem(chatKey, JSON.stringify(messages))
    }
  }, [messages, isInitialized, user, subject.program, subject.year, subject.name])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !user) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
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

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
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
                    <div 
                      className="break-words [&>strong]:font-semibold [&>em]:italic [&>code]:bg-muted [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-xs [&>h1]:text-base [&>h1]:font-semibold [&>h1]:mb-2 [&>h2]:text-sm [&>h2]:font-semibold [&>h2]:mb-1 [&>h3]:text-sm [&>h3]:font-medium [&>h3]:mb-1"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
                    />
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
        </div>
      </ScrollArea>

      {/* Floating Input */}
      <div className="absolute bottom-6 left-4 right-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="flex items-center bg-muted/40 rounded-full px-4 py-2 sm:px-5 sm:py-3 gap-2 sm:gap-4 border border-border/50 shadow-lg">
              <div className="flex-1 flex items-center">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  className="w-full resize-none bg-transparent text-sm sm:text-base placeholder:text-sm placeholder:sm:text-base placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[20px] max-h-[100px] border-0 p-0 leading-5"
                  rows={1}
                  disabled={isLoading}
                />
              </div>
              
              {/* Voice Recording Button */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                disabled={isLoading}
                className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center ${
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
                className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center ${
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
        </form>
      </div>
    </div>
  )
}