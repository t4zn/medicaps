'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LuBookmark, LuDownload, LuFileText, LuCalendar, LuExternalLink } from 'react-icons/lu'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { ProfilePicture } from '@/components/ui/profile-picture'
import { Pagination } from '@/components/ui/pagination'
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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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

  // Pagination helpers
  const getPaginatedItems = <T,>(items: T[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return items.slice(startIndex, endIndex)
  }

  const getTotalPages = (totalItems: number) => {
    return Math.ceil(totalItems / itemsPerPage)
  }
  
  const paginatedFiles = getPaginatedItems(savedFiles, currentPage)
  const totalPages = getTotalPages(savedFiles.length)

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading saved files...</p>
      </div>
    )
  }

  if (savedFiles.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <LuBookmark className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
        <div>
          <h3 className="text-lg font-light text-black dark:text-white mb-2">No saved files yet</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Bookmark files to save them for later access
          </p>
        </div>
        <Link href="/welcome">
          <Button className="bg-black dark:bg-white text-white dark:text-black hover:opacity-80">
            <LuFileText className="h-4 w-4 mr-2" />
            Browse Files
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <div className="text-center mb-6">
        <p className="text-gray-500 dark:text-gray-400 text-sm">{savedFiles.length} saved files</p>
      </div>
      
      <div className="space-y-3">
        {paginatedFiles.map((file) => (
          <div key={file.id} className="py-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <LuFileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <h3 className="font-medium text-black dark:text-white text-sm truncate flex-1 min-w-0">{file.original_name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${getCategoryColor(file.category)}`}>
                    {file.category === 'formula-sheet' ? 'Formula' : file.category.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <ProfilePicture 
                      avatarUrl={file.profiles?.avatar_url} 
                      fullName={file.profiles?.full_name}
                      userId={file.uploaded_by}
                      size={12} 
                    />
                    <span className="truncate">{file.profiles?.full_name || 'Anonymous'}</span>
                  </div>
                  <span className="whitespace-nowrap">{file.downloads} downloads</span>
                  <span className="whitespace-nowrap">{formatDate(file.created_at)}</span>
                </div>

                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {file.program.toUpperCase()} • {file.year.replace('-', ' ')} • {file.subject.replace('-', ' ')}
                </div>
              </div>

              <div className="flex items-center justify-end sm:justify-start gap-1 sm:gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-gray-500 hover:text-black dark:hover:text-white h-8 w-8 p-0"
                >
                  <Link href={getSubjectUrl(file)}>
                    <LuExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(file)}
                  disabled={!file.google_drive_url && !file.cdn_url}
                  className="text-gray-500 hover:text-black dark:hover:text-white h-8 w-8 p-0"
                >
                  <LuDownload className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveBookmark(file.id)}
                  className="text-blue-600 hover:text-blue-700 h-8 w-8 p-0"
                  title="Remove bookmark"
                >
                  <LuBookmark className="h-4 w-4 fill-current" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="mt-6"
      />
    </div>
  )
}