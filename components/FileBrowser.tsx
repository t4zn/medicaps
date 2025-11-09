'use client'

import { useState, useEffect, useCallback } from 'react'
import { LuDownload, LuSearch, LuFilter, LuFileText, LuCalendar, LuUser } from 'react-icons/lu'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'

interface FileItem {
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
  created_at: string
  profiles: {
    full_name: string
    email: string
  }
}

interface FileBrowserProps {
  initialProgram?: string
  initialYear?: string
  initialSubject?: string
  initialCategory?: string
}

export default function FileBrowser({
  initialProgram = '',
  initialYear = '',
  initialSubject = '',
  initialCategory = '',
}: FileBrowserProps) {
  const { user } = useAuth()
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    program: initialProgram,
    year: initialYear,
    subject: initialSubject,
    category: initialCategory,
  })

  const fetchFiles = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.program) params.append('program', filters.program)
      if (filters.year) params.append('year', filters.year)
      if (filters.subject) params.append('subject', filters.subject)
      if (filters.category) params.append('category', filters.category)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/files?${params}`)
      const data = await response.json()

      if (data.files) {
        setFiles(data.files)
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }, [filters, searchTerm])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const handleDownload = async (file: FileItem) => {
    try {
      // Track download
      await fetch(`/api/download/${file.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id || null,
        }),
      })

      // Open download link
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

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LuSearch className="h-5 w-5" />
            Search & Filter Files
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files by name or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              value={filters.category}
              onValueChange={(value: string) =>
                setFilters({ ...filters, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="notes">Notes</SelectItem>
                <SelectItem value="pyqs">PYQs</SelectItem>
                <SelectItem value="formula-sheet">Formula Sheet</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.program}
              onValueChange={(value: string) =>
                setFilters({ ...filters, program: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Programs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Programs</SelectItem>
                <SelectItem value="btech">B.Tech</SelectItem>
                <SelectItem value="bsc">B.Sc</SelectItem>
                <SelectItem value="bba">BBA</SelectItem>
                <SelectItem value="bcom">B.Com</SelectItem>
                <SelectItem value="mtech">M.Tech</SelectItem>
                <SelectItem value="mba">MBA</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.year}
              onValueChange={(value: string) =>
                setFilters({ ...filters, year: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Years</SelectItem>
                <SelectItem value="1st-year">1st Year</SelectItem>
                <SelectItem value="2nd-year">2nd Year</SelectItem>
                <SelectItem value="3rd-year">3rd Year</SelectItem>
                <SelectItem value="4th-year">4th Year</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setFilters({ program: '', year: '', subject: '', category: '' })
                setSearchTerm('')
              }}
            >
              <LuFilter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <LuFileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No files found matching your criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          files.map((file) => (
            <Card key={file.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <LuFileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <h3 className="font-semibold truncate">{file.original_name}</h3>
                      <Badge className={getCategoryColor(file.category)}>
                        {file.category.replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <LuUser className="h-3 w-3" />
                        {file.profiles.full_name || 'Anonymous'}
                      </span>
                      <span className="flex items-center gap-1">
                        <LuCalendar className="h-3 w-3" />
                        {formatDate(file.created_at)}
                      </span>
                      <span>{formatFileSize(file.file_size)}</span>
                      <span>{file.downloads} downloads</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {file.program.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {file.year.replace('-', ' ')}
                      </Badge>
                      {file.subject && (
                        <Badge variant="outline">
                          {file.subject.replace('-', ' ')}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleDownload(file)}
                    className="ml-4 flex-shrink-0"
                  >
                    <LuDownload className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}