'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { LuDownload, LuFileText, LuCalendar, LuUser, LuUpload } from 'react-icons/lu'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface FileItem {
  id: string
  filename: string
  original_name: string
  cdn_url: string
  file_size: number
  downloads: number
  uploaded_by: string
  created_at: string
  profiles?: {
    full_name: string
  }
}

interface SubjectPageProps {
  subject: {
    name: string
    description: string
    program: string
    year: string
    category: string
    code?: string
  }
}

export default function SubjectPage({ subject }: SubjectPageProps) {
  const { user } = useAuth()
  const [notesFiles, setNotesFiles] = useState<FileItem[]>([])
  const [pyqsFiles, setPyqsFiles] = useState<FileItem[]>([])
  const [formulaFiles, setFormulaFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)


  const fetchFiles = useCallback(async (category: string) => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select(`
          *,
          profiles:uploaded_by (
            full_name
          )
        `)
        .eq('program', subject.program)
        .eq('year', subject.year)
        .eq('subject', subject.name.toLowerCase().replace(/\s+/g, '-'))
        .eq('category', category)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching files:', error)
      return []
    }
  }, [subject.program, subject.year, subject.name])

  const fetchAllFiles = useCallback(async () => {
    setLoading(true)
    try {
      const [notes, pyqs, formulas] = await Promise.all([
        fetchFiles('notes'),
        fetchFiles('pyqs'),
        fetchFiles('formula-sheet')
      ])
      
      setNotesFiles(notes)
      setPyqsFiles(pyqs)
      setFormulaFiles(formulas)
    } finally {
      setLoading(false)
    }
  }, [fetchFiles])

  useEffect(() => {
    fetchAllFiles()
  }, [fetchAllFiles])

  const handleDownload = async (file: FileItem) => {
    try {
      // Track download
      await fetch(`/api/download/${file.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      })

      // Open file in new tab
      window.open(file.cdn_url, '_blank')
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const renderFileList = (files: FileItem[], category: string) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (files.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center">
            <LuFileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No {category} available yet</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Be the first to contribute {category} for {subject.name}.
            </p>
            {user && (
              <Link href="/upload">
                <Button>
                  <LuUpload className="h-4 w-4 mr-2" />
                  Upload First File
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-3">
        {files.map((file) => (
          <Card key={file.id} className="hover:shadow-sm transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <LuFileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <h3 className="font-medium truncate">{file.original_name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <LuCalendar className="h-3 w-3" />
                      {formatDate(file.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <LuUser className="h-3 w-3" />
                      {file.profiles?.full_name || 'Anonymous'}
                    </div>
                    <span>{formatFileSize(file.file_size)}</span>
                    <span>{file.downloads} downloads</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleDownload(file)}
                  size="sm"
                  className="ml-4 flex-shrink-0"
                >
                  <LuDownload className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-3">{subject.name}</h1>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">{subject.program.toUpperCase()}</Badge>
              <Badge variant="outline">{subject.year.replace('-', ' ')}</Badge>
              {subject.code && <Badge variant="secondary">{subject.code}</Badge>}
            </div>
          </div>

          <div className="max-w-2xl">
            <p className="text-muted-foreground leading-relaxed">
              {subject.description}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="notes" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="pyqs">PYQs</TabsTrigger>
          <TabsTrigger value="formula-sheets">Formula Sheets</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Notes</h2>
            <span className="text-sm text-muted-foreground">
              {notesFiles.length} {notesFiles.length === 1 ? 'file' : 'files'} available
            </span>
          </div>
          {renderFileList(notesFiles, 'notes')}
        </TabsContent>

        <TabsContent value="pyqs" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Previous Year Questions</h2>
            <span className="text-sm text-muted-foreground">
              {pyqsFiles.length} {pyqsFiles.length === 1 ? 'file' : 'files'} available
            </span>
          </div>
          {renderFileList(pyqsFiles, 'PYQs')}
        </TabsContent>

        <TabsContent value="formula-sheets" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Formula Sheets</h2>
            <span className="text-sm text-muted-foreground">
              {formulaFiles.length} {formulaFiles.length === 1 ? 'file' : 'files'} available
            </span>
          </div>
          {renderFileList(formulaFiles, 'formula sheets')}
        </TabsContent>
      </Tabs>
    </div>
  )
}