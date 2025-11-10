'use client'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from 'next-themes'

interface CodeBlockProps {
  children: string
  language?: string
  className?: string
}

export function CodeBlock({ children, language, className }: CodeBlockProps) {
  const { theme } = useTheme()
  
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
  
  return (
    <div className="w-full min-w-0 overflow-x-auto my-4 border border-border rounded-lg">
      <SyntaxHighlighter
        language={finalLanguage}
        style={theme === 'dark' ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          fontSize: '12px',
          lineHeight: '1.4',
          padding: '12px',
          background: theme === 'dark' ? 'hsl(var(--muted))' : 'hsl(var(--muted))',
          whiteSpace: 'pre',
          wordBreak: 'keep-all',
          wordWrap: 'normal',
          minWidth: 'max-content',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }
        }}
        wrapLines={false}
        wrapLongLines={false}
      >
        {children.trim()}
      </SyntaxHighlighter>
    </div>
  )
}