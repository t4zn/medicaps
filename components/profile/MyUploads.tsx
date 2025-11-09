'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import { LuFileText, LuDownload, LuTrash2, LuUpload } from 'react-icons/lu'
import Link from 'next/link'

interface UploadedFile {
  id: string
  filename: string
  original_name: string
  file_path: string
  cdn_url: string
  file_size: number
  program: string
  year: string
  subject: string | null
  category: string
  downloads: number
  is_approved: boolean
  created_at: string
}

export default function MyUploads() {
  const { user } = useAuth()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMyUploads = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('uploaded_by', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFiles(data || [])
    } catch (err) {
      console.error('Error fetching uploads:', err)
      setError('Failed to load your uploads')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchMyUploads()
    }
  }, [user, fetchMyUploads])

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId)
        .eq('uploaded_by', user?.id) // Extra security check

      if (error) throw error

      setFiles(files.filter(file => file.id !== fileId))
    } catch (err) {
      console.error('Error deleting file:', err)
      setError('Failed to delete file')
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



  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your uploads...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <LuFileText className="h-5 w-5" />
            My Uploads ({files.length})
          </span>
          <Link href="/upload">
            <Button size="sm">
              <LuUpload className="h-4 w-4 mr-2" />
              Upload New
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {files.length === 0 ? (
          <div className="text-center py-12">
            <LuFileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No files uploaded yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven&apos;t uploaded any files yet. Start sharing your notes, PYQs, and study materials with the community.
            </p>
            <Link href="/upload">
              <Button size="lg">
                <LuUpload className="h-4 w-4 mr-2" />
                Upload Your First File
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start sm:items-center gap-2 mb-2">
                      <LuFileText className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm sm:text-base break-words">{file.original_name}</h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs mt-1 ${file.is_approved ? 'text-green-600 border-green-200' : 'text-yellow-600 border-yellow-200'}`}
                        >
                          {file.is_approved ? 'Approved' : 'Pending Review'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        📅 {formatDate(file.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        📁 {formatFileSize(file.file_size)}
                      </span>
                      <span className="flex items-center gap-1">
                        📥 {file.downloads} downloads
                      </span>
                      <span className="flex items-center gap-1 capitalize">
                        🏷️ {file.category.replace('-', ' ')}
                      </span>
                    </div>

                    {/* Additional file details */}
                    <div className="mt-2 text-xs text-muted-foreground">
                      <span className="inline-block bg-muted px-2 py-1 rounded mr-2">{file.program}</span>
                      <span className="inline-block bg-muted px-2 py-1 rounded mr-2">{file.year}</span>
                      {file.subject && (
                        <span className="inline-block bg-muted px-2 py-1 rounded">{file.subject}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:flex-col sm:gap-1">
                    {file.is_approved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.cdn_url, '_blank')}
                        className="flex-1 sm:flex-none"
                      >
                        <LuDownload className="h-4 w-4 mr-2 sm:mr-0" />
                        <span className="sm:hidden">Download</span>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(file.id)}
                      className="text-red-600 hover:text-red-700 flex-1 sm:flex-none"
                    >
                      <LuTrash2 className="h-4 w-4 mr-2 sm:mr-0" />
                      <span className="sm:hidden">Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}