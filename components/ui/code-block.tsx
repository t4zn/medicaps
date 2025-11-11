'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { LuCopy, LuCheck } from 'react-icons/lu'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  children: string
  language?: string
  className?: string
}

export function CodeBlock({ children, language, className }: CodeBlockProps) {
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)
  
  // Debug logging
  console.log('🎨 CodeBlock rendered with:', {
    children: children?.substring(0, 50) + '...',
    language,
    className,
    theme,
    timestamp: new Date().toISOString()
  })
  
  // Extract language from className (e.g., "language-python" -> "python")
  const detectedLanguage = className?.replace('language-', '') || language || 'text'
  
  // Map common language aliases
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'jsx': 'javascript',
    'tsx': 'typescript',
    'py': 'python',
    'rb': 'ruby',
    'sh': 'bash',
    'yml': 'yaml',
    'md': 'markdown',
  }
  
  const finalLanguage = languageMap[detectedLanguage.toLowerCase()] || detectedLanguage.toLowerCase()
  
  // Map languages to file extensions
  const getFileExtension = (lang: string): string => {
    const extensionMap: Record<string, string> = {
      'python': '.py',
      'javascript': '.js',
      'typescript': '.ts',
      'java': '.java',
      'cpp': '.cpp',
      'c': '.c',
      'html': '.html',
      'css': '.css',
      'sql': '.sql',
      'bash': '.sh',
      'shell': '.sh',
      'json': '.json',
      'xml': '.xml',
      'yaml': '.yml',
      'markdown': '.md',
      'php': '.php',
      'ruby': '.rb',
      'go': '.go',
      'rust': '.rs',
      'swift': '.swift',
      'kotlin': '.kt',
      'scala': '.scala',
      'r': '.r',
      'matlab': '.m',
      'text': '.txt'
    }
    return extensionMap[lang.toLowerCase()] || `.${lang}`
  }
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  // Monaco editor color scheme for styling the container
  const monacoColors = {
    dark: {
      background: '#1e1e1e',
      foreground: '#d4d4d4',
      border: '#3e3e42',
      headerBg: '#2d2d30',
    },
    light: {
      background: '#ffffff',
      foreground: '#000000',
      border: '#e5e5e5',
      headerBg: '#f8f8f8',
    }
  }

  const colors = theme === 'dark' ? monacoColors.dark : monacoColors.light

  console.log('🎨 Monaco colors selected:', {
    theme,
    colors: {
      background: colors.background,
      foreground: colors.foreground,
    }
  })

  // Use VS Code themes which are closest to Monaco editor
  const syntaxTheme = theme === 'dark' ? vscDarkPlus : vs

  console.log('🎨 CodeBlock rendering with finalLanguage:', finalLanguage)

  return (
    <div 
      className="w-full min-w-0 my-4 border border-border rounded-lg"
      style={{ 
        backgroundColor: colors.background,
        borderColor: colors.border,
      }}
    >
        {/* Header with language and copy button */}
        <div 
          className="flex items-center justify-between px-4 py-2 border-b text-xs font-medium"
          style={{ 
            borderColor: colors.border,
            color: colors.foreground,
            backgroundColor: colors.headerBg
          }}
        >
          <span className="text-xs font-mono opacity-70">
            {getFileExtension(finalLanguage)}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title={copied ? "Copied!" : "Copy code"}
          >
            {copied ? (
              <LuCheck className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <LuCopy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        
        {/* Code content with syntax highlighting */}
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={finalLanguage}
            style={syntaxTheme}
            customStyle={{
              margin: 0,
              padding: '16px',
              fontSize: '14px',
              lineHeight: '1.5',
              backgroundColor: colors.background,
              fontFamily: 'Consolas, "Courier New", Monaco, "Lucida Console", monospace',
              whiteSpace: 'pre',
              wordBreak: 'keep-all',
              overflowWrap: 'normal',
              wordWrap: 'normal',
              minWidth: 'max-content',
            }}
            wrapLines={false}
            wrapLongLines={false}
            PreTag="div"
          >
            {children.trim()}
          </SyntaxHighlighter>
        </div>
    </div>
  )
}