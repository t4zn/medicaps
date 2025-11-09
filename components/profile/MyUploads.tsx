'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import { LuFileText, LuDownload, LuCalendar, LuEye, LuTrash2, LuUpload } from 'react-icons/lu'
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

  useEffect(() => {
    if (user) {
      fetchMyUploads()
    }
  }, [user])

  const fetchMyUploads = async () => {
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
  }

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

  const getStatusColor = (isApproved: boolean) => {
    return isApproved 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'notes':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'pyqs':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'formula-sheet':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
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
          <div className="text-center py-8">
            <LuFileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              You haven't uploaded any files yet.
            </p>
            <Link href="/upload">
              <Button>
                <LuUpload className="h-4 w-4 mr-2" />
                Upload Your First File
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <LuFileText className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <h3 className="font-medium truncate text-sm">{file.original_name}</h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${file.is_approved ? 'text-green-600' : 'text-yellow-600'}`}
                      >
                        {file.is_approved ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatDate(file.created_at)}</span>
                      <span>{formatFileSize(file.file_size)}</span>
                      <span>{file.downloads} downloads</span>
                      <span className="capitalize">{file.category.replace('-', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    {file.is_approved && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(file.cdn_url, '_blank')}
                      >
                        <LuDownload className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(file.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <LuTrash2 className="h-4 w-4" />
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