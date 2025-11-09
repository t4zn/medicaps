'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { LuDownload, LuFileText, LuCalendar, LuUser, LuUpload, LuTrash2, LuThumbsUp, LuThumbsDown, LuFlag } from 'react-icons/lu'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
  upVotes?: number
  downVotes?: number
  userVote?: 'up' | 'down' | null
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
  const { user, isAdmin } = useAuth()
  const [notesFiles, setNotesFiles] = useState<FileItem[]>([])
  const [pyqsFiles, setPyqsFiles] = useState<FileItem[]>([])
  const [formulaFiles, setFormulaFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [reportDialog, setReportDialog] = useState<{ open: boolean; fileId: string | null }>({ open: false, fileId: null })
  const [reportReason, setReportReason] = useState('')
  const [reportDescription, setReportDescription] = useState('')
  const [reportSubmitting, setReportSubmitting] = useState(false)


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
      
      // Fetch vote counts for each file
      const filesWithVotes = await Promise.all((data || []).map(async (file) => {
        try {
          const response = await fetch(`/api/vote?fileId=${file.id}${user ? `&userId=${user.id}` : ''}`)
          const voteData = await response.json()
          
          return {
            ...file,
            upVotes: voteData.upVotes || 0,
            downVotes: voteData.downVotes || 0,
            userVote: voteData.userVote || null
          }
        } catch (error) {
          console.error('Error fetching votes for file:', file.id, error)
          return {
            ...file,
            upVotes: 0,
            downVotes: 0,
            userVote: null
          }
        }
      }))
      
      return filesWithVotes
    } catch (error) {
      console.error('Error fetching files:', error)
      return []
    }
  }, [subject.program, subject.year, subject.name, user])

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

  const handleAdminDelete = async (fileId: string, category: string) => {
    if (!isAdmin || !user) return
    
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) return

    try {
      const response = await fetch(`/api/admin/delete?fileId=${fileId}&userId=${user.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove file from the appropriate state array
        if (category === 'notes') {
          setNotesFiles(prev => prev.filter(file => file.id !== fileId))
        } else if (category === 'pyqs') {
          setPyqsFiles(prev => prev.filter(file => file.id !== fileId))
        } else if (category === 'formula-sheet') {
          setFormulaFiles(prev => prev.filter(file => file.id !== fileId))
        }
      } else {
        console.error('Failed to delete file')
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const handleVote = async (fileId: string, voteType: 'up' | 'down', category: string) => {
    if (!user) return

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, voteType, userId: user.id }),
      })

      if (response.ok) {
        const result = await response.json()
        
        // Update the appropriate state array
        const updateFile = (file: FileItem) => 
          file.id === fileId 
            ? { ...file, upVotes: result.upVotes, downVotes: result.downVotes, userVote: result.userVote }
            : file

        if (category === 'notes') {
          setNotesFiles(prev => prev.map(updateFile))
        } else if (category === 'pyqs') {
          setPyqsFiles(prev => prev.map(updateFile))
        } else if (category === 'formula-sheet') {
          setFormulaFiles(prev => prev.map(updateFile))
        }
      }
    } catch (error) {
      console.error('Vote error:', error)
    }
  }

  const handleReport = async () => {
    if (!user || !reportDialog.fileId || !reportReason) return

    setReportSubmitting(true)
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId: reportDialog.fileId,
          reason: reportReason,
          description: reportDescription,
          userId: user.id
        }),
      })

      if (response.ok) {
        setReportDialog({ open: false, fileId: null })
        setReportReason('')
        setReportDescription('')
        // You could show a success message here
      }
    } catch (error) {
      console.error('Report error:', error)
    } finally {
      setReportSubmitting(false)
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
      // Create upload URL with pre-filled parameters
      const categoryParam = category === 'PYQs' ? 'pyqs' : category === 'formula sheets' ? 'formula-sheet' : category
      const subjectParam = subject.name.toLowerCase().replace(/\s+/g, '-')
      const uploadUrl = `/upload?program=${subject.program}&year=${subject.year}&subject=${subjectParam}&category=${categoryParam}`

      return (
        <Card>
          <CardContent className="py-12 text-center">
            <LuFileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No {category} available yet</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Be the first to contribute {category} for {subject.name}.
            </p>
            {user && (
              <Link href={uploadUrl}>
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <LuFileText className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <h3 className="font-medium break-words leading-tight">{file.original_name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <LuCalendar className="h-3 w-3" />
                      <span className="truncate">{formatDate(file.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <LuUser className="h-3 w-3" />
                      <span className="truncate">{file.profiles?.full_name || 'Anonymous'}</span>
                    </div>
                    <span className="truncate">{formatFileSize(file.file_size)}</span>
                    <span className="truncate">{file.downloads} downloads</span>
                  </div>
                  
                  {/* Voting and Report Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(file.id, 'up', category === 'PYQs' ? 'pyqs' : category === 'formula sheets' ? 'formula-sheet' : category)}
                        className={`h-7 px-2 ${file.userVote === 'up' ? 'text-green-600 bg-green-50' : 'text-muted-foreground hover:text-green-600'}`}
                        disabled={!user}
                      >
                        <LuThumbsUp className="h-3 w-3 mr-1" />
                        {file.upVotes || 0}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(file.id, 'down', category === 'PYQs' ? 'pyqs' : category === 'formula sheets' ? 'formula-sheet' : category)}
                        className="h-7 px-2 text-muted-foreground hover:text-red-600"
                        disabled={!user}
                      >
                        <LuThumbsDown className="h-3 w-3 mr-1" />
                        {file.downVotes || 0}
                      </Button>
                    </div>
                    
                    {user && (
                      <Dialog open={reportDialog.open && reportDialog.fileId === file.id} onOpenChange={(open) => setReportDialog({ open, fileId: open ? file.id : null })}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-muted-foreground hover:text-red-600"
                          >
                            <LuFlag className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Report File</DialogTitle>
                            <DialogDescription>
                              Help us maintain quality by reporting inappropriate content.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Reason for reporting</label>
                              <Select value={reportReason} onValueChange={setReportReason}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select a reason" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                                  <SelectItem value="copyright">Copyright Violation</SelectItem>
                                  <SelectItem value="spam">Spam or Misleading</SelectItem>
                                  <SelectItem value="wrong_category">Wrong Category</SelectItem>
                                  <SelectItem value="low_quality">Low Quality</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Additional details (optional)</label>
                              <textarea
                                placeholder="Provide more details about the issue..."
                                value={reportDescription}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReportDescription(e.target.value)}
                                className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                rows={3}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setReportDialog({ open: false, fileId: null })}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleReport}
                              disabled={!reportReason || reportSubmitting}
                            >
                              {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4 flex-shrink-0">
                  <Button
                    onClick={() => handleDownload(file)}
                    size="sm"
                  >
                    <LuDownload className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  {isAdmin && (
                    <Button
                      onClick={() => handleAdminDelete(file.id, category === 'PYQs' ? 'pyqs' : category === 'formula sheets' ? 'formula-sheet' : category)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LuTrash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
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