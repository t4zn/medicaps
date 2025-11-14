'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LuBookmark, LuDownload, LuFileText, LuCalendar, LuExternalLink } from 'react-icons/lu'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProfilePicture } from '@/components/ui/profile-picture'
import { handleFileDownload } from '@/utils/download-helper'

interface SavedFile {
  id: string
  filename: string
  original_name: string
  google_drive_url: string
  cdn_url: string
  file_size: number | null
  downloads: number
  program: string
  year: string
  branch: string | null
  subject: string
  category: string
  created_at: string
  uploaded_by: string
  profiles?: {
    full_name: string
    avatar_url: string | null
  }
}

export default function SavedResources() {
  const { user } = useAuth()
  const [savedFiles, setSavedFiles] = useState<SavedFile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchSavedFiles()
    }
  }, [user])

  const fetchSavedFiles = async () => {
    if (!user) return

    try {
      // First check if the table exists by trying a simple query
      const { data, error } = await supabase
        .from('file_bookmarks')
        .select(`
          file_id,
          files!inner (
            id,
            filename,
            original_name,
            google_drive_url,
            cdn_url,
            file_size,
            downloads,
            program,
            year,
            branch,
            subject,
            category,
            created_at,
            uploaded_by,
            profiles:uploaded_by (
              full_name,
              avatar_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        // If table doesn't exist or other error, show empty state
        setSavedFiles([])
        return
      }

      // Handle the nested structure properly
      const files = data?.map((bookmark) => {
        const file = Array.isArray(bookmark.files) ? bookmark.files[0] : bookmark.files
        return {
          ...file,
          profiles: file?.profiles || { full_name: 'Unknown', avatar_url: null }
        }
      }).filter(Boolean) || []
      
      setSavedFiles(files as unknown as SavedFile[])
    } catch (error) {
      console.error('Error fetching saved files:', error)
      setSavedFiles([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (file: SavedFile) => {
    await handleFileDownload({
      fileId: file.id,
      userId: user?.id,
      onError: (error) => {
        console.error('Download error:', error)
        alert(error)
      }
    })
  }

  const handleRemoveBookmark = async (fileId: string) => {
    if (!user) return

    try {
      const response = await fetch('/api/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, userId: user.id }),
      })

      if (response.ok) {
        // Remove from local state
        setSavedFiles(prev => prev.filter(file => file.id !== fileId))
      }
    } catch (error) {
      console.error('Remove bookmark error:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'notes': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'pyqs': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'formula-sheet': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getSubjectUrl = (file: SavedFile) => {
    // Always redirect to notes page regardless of category
    if (file.year === '1st-year') {
      return `/notes/${file.program}/${file.year}/${file.subject}`
    }
    // Use the actual branch from the file data, fallback to 'cse' if not available
    const branch = file.branch || 'cse'
    return `/notes/${file.program}/${branch}/${file.year}/${file.subject}`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (savedFiles.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <LuBookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No saved resources yet</h3>
          <p className="text-muted-foreground mb-4">
            Start bookmarking files you want to save for later by clicking the bookmark icon on any file.
          </p>
          <Button asChild>
            <Link href="/welcome">
              <LuFileText className="h-4 w-4 mr-2" />
              Browse Files
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Saved Resources ({savedFiles.length})</h2>
      </div>
      
      {savedFiles.map((file) => (
        <Card key={file.id}>
          <CardContent className="p-0">
            {/* Mobile Layout */}
            <div className="block sm:hidden p-3">
              <div className="flex items-start gap-3 mb-3">
                <LuFileText className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm leading-tight mb-1 break-words">{file.original_name}</h3>
                  <Badge className={`${getCategoryColor(file.category)} text-xs`}>
                    {file.category === 'formula-sheet' ? 'Formula' : file.category.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-2">
                  <ProfilePicture 
                    avatarUrl={file.profiles?.avatar_url} 
                    fullName={file.profiles?.full_name}
                    userId={file.uploaded_by}
                    size={12} 
                  />
                  <span className="truncate">{file.profiles?.full_name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{file.downloads} downloads</span>
                  <span>{formatDate(file.created_at)}</span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground mb-3">
                {file.program.toUpperCase()} • {file.year.replace('-', ' ')} • {file.subject.replace('-', ' ')}
              </div>
              
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1 h-8 text-xs"
                >
                  <Link href={getSubjectUrl(file)}>
                    <LuExternalLink className="h-3 w-3 mr-1" />
                    View
                  </Link>
                </Button>
                
                <Button
                  onClick={() => handleDownload(file)}
                  size="sm"
                  disabled={!file.google_drive_url && !file.cdn_url}
                  className="flex-1 h-8 text-xs"
                >
                  <LuDownload className="h-3 w-3 mr-1" />
                  Download
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveBookmark(file.id)}
                  className="text-blue-600 hover:text-blue-700 h-8 w-8 p-0"
                  title="Remove bookmark"
                >
                  <LuBookmark className="h-3 w-3 fill-current" />
                </Button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:block sm:p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <LuFileText className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <h3 className="font-medium truncate">{file.original_name}</h3>
                    <Badge className={getCategoryColor(file.category)}>
                      {file.category === 'formula-sheet' ? 'Formula Sheet' : file.category.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <LuCalendar className="h-3 w-3" />
                      <span>{formatDate(file.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ProfilePicture 
                        avatarUrl={file.profiles?.avatar_url} 
                        fullName={file.profiles?.full_name}
                        userId={file.uploaded_by}
                        size={16} 
                      />
                      <span className="truncate">{file.profiles?.full_name || 'Anonymous'}</span>
                    </div>
                    <span>{file.downloads} downloads</span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {file.program.toUpperCase()} • {file.year.replace('-', ' ')} • {file.subject.replace('-', ' ')}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={getSubjectUrl(file)}>
                      <LuExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Link>
                  </Button>
                  
                  <Button
                    onClick={() => handleDownload(file)}
                    size="sm"
                    disabled={!file.google_drive_url && !file.cdn_url}
                  >
                    <LuDownload className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveBookmark(file.id)}
                    className="text-blue-600 hover:text-blue-700"
                    title="Remove bookmark"
                  >
                    <LuBookmark className="h-3 w-3 fill-current" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}