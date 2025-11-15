'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { 
  LuFileText, 
  LuDownload, 
  LuTrash2, 
  LuUpload
} from 'react-icons/lu'
import Link from 'next/link'
import { handleDirectDownload } from '@/utils/download-helper'

interface UploadedFile {
  id: string
  filename: string
  original_name: string
  file_path: string | null
  cdn_url: string | null
  google_drive_url: string | null
  file_size: number | null
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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchMyUploads = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('uploaded_by', user.id)
        .order('downloads', { ascending: false })
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

      // Remove from local state and refresh from database to ensure consistency
      setFiles(files.filter(file => file.id !== fileId))
      
      // Optionally refresh the data from database after a short delay
      setTimeout(() => {
        fetchMyUploads()
      }, 500)
    } catch (err) {
      console.error('Error deleting file:', err)
      setError('Failed to delete file')
    }
  }



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
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
  
  const paginatedFiles = getPaginatedItems(files, currentPage)
  const totalPages = getTotalPages(files.length)



  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading uploads...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      {error && (
        <div className="text-center text-red-600 dark:text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {files.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <LuFileText className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
          <div>
            <h3 className="text-lg font-light text-black dark:text-white mb-2">No uploads yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Share your study materials with the community
            </p>
          </div>
          <Link href="/upload">
            <Button className="bg-black dark:bg-white text-white dark:text-black hover:opacity-80">
              <LuUpload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-center mb-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm">{files.length} files uploaded</p>
          </div>
          
          {paginatedFiles.map((file) => (
            <div key={file.id} className="py-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <LuFileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <h3 className="font-medium text-black dark:text-white text-sm truncate flex-1 min-w-0">{file.original_name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${
                      file.is_approved 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {file.is_approved ? 'Live' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2 flex-wrap">
                    <span className="whitespace-nowrap">{formatDate(file.created_at)}</span>
                    <span className="whitespace-nowrap">{file.downloads} downloads</span>
                    <span className="capitalize whitespace-nowrap">{file.category.replace('-', ' ')}</span>
                  </div>

                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {file.program.toUpperCase()} • {file.year} • {file.subject}
                  </div>
                </div>

                <div className="flex items-center justify-end sm:justify-start gap-1 sm:gap-2 flex-shrink-0">
                  {file.is_approved && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const downloadUrl = file.google_drive_url || file.cdn_url || ''
                        handleDirectDownload(
                          downloadUrl, 
                          'Download link not available. Please update your file with a valid Google Drive link.'
                        )
                      }}
                      className="text-gray-500 hover:text-black dark:hover:text-white h-8 w-8 p-0"
                    >
                      <LuDownload className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                    className="text-gray-500 hover:text-red-600 h-8 w-8 p-0"
                  >
                    <LuTrash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-6"
          />
        </div>
      )}
    </div>
  )
}