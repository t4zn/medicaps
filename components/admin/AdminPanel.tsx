'use client'

import { useState, useEffect, useCallback } from 'react'
import { LuCheck, LuX, LuFileText, LuUser, LuRefreshCw, LuFlag, LuEye, LuShield, LuSettings, LuChevronLeft } from 'react-icons/lu'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { SubjectRequestsAdmin } from '@/components/admin/SubjectRequestsAdmin'
import { UserManagement } from '@/components/admin/UserManagement'
import { RoleRequestsAdmin } from '@/components/admin/RoleRequestsAdmin'

interface PendingFile {
  id: string
  filename: string
  original_name: string
  file_size: number
  program: string
  branch?: string
  year: string
  subject: string
  category: string
  created_at: string
  profiles?: {
    full_name: string
    email: string
  }
}

interface FileReport {
  id: string
  reason: string
  description: string
  status: string
  created_at: string
  files: {
    id: string
    original_name: string
    program: string
    year: string
    subject: string
    category: string
  }
  profiles: {
    full_name: string
    email: string
  }
}

type AdminSection = 'files' | 'all-files' | 'reports' | 'subjects' | 'users' | 'role-requests' | 'overview'

export default function AdminPanel() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState<AdminSection>('files')
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const [allFiles, setAllFiles] = useState<PendingFile[]>([])
  const [reports, setReports] = useState<FileReport[]>([])
  const [loading, setLoading] = useState(true)
  const [allFilesLoading, setAllFilesLoading] = useState(true)
  const [reportsLoading, setReportsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // Pagination states
  const [pendingFilesPage, setPendingFilesPage] = useState(1)
  const [allFilesPage, setAllFilesPage] = useState(1)
  const [reportsPage, setReportsPage] = useState(1)
  const itemsPerPage = 10
  
  // Mobile responsive logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { // lg breakpoint
        if (activeSection !== 'overview' && activeSection === 'files') {
          setActiveSection('overview')
        }
      }
    }
    
    // Set initial state
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getBranchUrlSlug = (fullBranchName: string): string => {
    const branchMapping: Record<string, string> = {
      'computer-science-and-engineering': 'cse',
      'ece-electronics-communication-engineering': 'ece',
      'ce-civil-engineering': 'civil',
      'ee-electrical-engineering': 'electrical',
      'mechanical-engineering': 'mechanical',
      'au-ev-automobile-engineering-electric-vehicle': 'automobile',
      'it-information-technology': 'it',
      'ra-robotics-and-automation': 'robotics'
    }
    return branchMapping[fullBranchName] || fullBranchName
  }

  const fetchPendingFiles = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/files?userId=${user.id}`)
      const data = await response.json()
      if (response.ok) {
        setPendingFiles(data.files || [])
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to fetch files' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setLoading(false)
    }
  }, [user])

  const fetchAllFiles = useCallback(async () => {
    if (!user) return
    try {
      setAllFilesLoading(true)
      const response = await fetch(`/api/admin/all-files?userId=${user.id}`)
      const data = await response.json()
      if (response.ok) {
        setAllFiles(data.files || [])
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to fetch all files' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setAllFilesLoading(false)
    }
  }, [user])

  const fetchReports = useCallback(async () => {
    if (!user) return
    try {
      setReportsLoading(true)
      const response = await fetch(`/api/report?userId=${user.id}`)
      const data = await response.json()
      if (response.ok) {
        setReports(data.reports || [])
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to fetch reports' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setReportsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchPendingFiles()
    fetchAllFiles()
    fetchReports()
  }, [user, fetchPendingFiles, fetchAllFiles, fetchReports])

  const handleFileAction = async (fileId: string, action: 'approve' | 'reject') => {
    if (!user) return
    try {
      setActionLoading(fileId)
      const response = await fetch('/api/admin/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, action, userId: user.id }),
      })
      const data = await response.json()
      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        setPendingFiles(prev => prev.filter(file => file.id !== fileId))
      } else {
        setMessage({ type: 'error', text: data.error || 'Action failed' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleReportAction = async (reportId: string, action: 'resolve' | 'dismiss') => {
    if (!user) return
    try {
      setActionLoading(reportId)
      const response = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, action, userId: user.id }),
      })
      const data = await response.json()
      if (response.ok) {
        setMessage({ type: 'success', text: data.message })
        setReports(prev => prev.filter(report => report.id !== reportId))
      } else {
        setMessage({ type: 'error', text: data.error || 'Action failed' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setActionLoading(null)
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
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading admin panel...</p>
      </div>
    )
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

  const getSectionTitle = (section: AdminSection) => {
    switch (section) {
      case 'files': return 'Pending Files'
      case 'all-files': return 'All Files'
      case 'reports': return 'Reports'
      case 'subjects': return 'Subject Requests'
      case 'users': return 'Users'
      case 'role-requests': return 'Role Requests'
      default: return 'Admin Panel'
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Content Management Section */}
            <div className="space-y-4">
              <h3 className="text-md font-light text-black dark:text-white mb-6">Content Management</h3>
              <div className="space-y-0">
                <button
                  onClick={() => setActiveSection('files')}
                  className="py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left group w-full"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <LuFileText className="h-4 w-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                      <span className="font-light text-black dark:text-white">Pending Files</span>
                    </div>
                    {pendingFiles.length > 0 && (
                      <span className="text-xs px-2 py-1 bg-black dark:bg-white text-white dark:text-black">
                        {pendingFiles.length}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Review and approve uploaded files
                  </p>
                </button>

                <div className="border-b border-gray-200 dark:border-gray-800"></div>

                <button
                  onClick={() => setActiveSection('all-files')}
                  className="py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left group w-full"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <LuEye className="h-4 w-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                      <span className="font-light text-black dark:text-white">All Files</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-black dark:bg-white text-white dark:text-black">
                      {allFiles.length}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    View all approved files
                  </p>
                </button>

                <div className="border-b border-gray-200 dark:border-gray-800"></div>

                <button
                  onClick={() => setActiveSection('reports')}
                  className="py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left group w-full"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <LuFlag className="h-4 w-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                      <span className="font-light text-black dark:text-white">Reports</span>
                    </div>
                    {reports.length > 0 && (
                      <span className="text-xs px-2 py-1 bg-black dark:bg-white text-white dark:text-black">
                        {reports.length}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Handle user reports
                  </p>
                </button>

                <div className="border-b border-gray-200 dark:border-gray-800"></div>

                <button
                  onClick={() => setActiveSection('subjects')}
                  className="py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left group w-full"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <LuSettings className="h-4 w-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                    <span className="font-light text-black dark:text-white">Subject Requests</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage subject requests
                  </p>
                </button>
              </div>
            </div>

            {/* User Management Section */}
            <div className="space-y-4">
              <h3 className="text-md font-light text-black dark:text-white mb-6">User Management</h3>
              <div className="space-y-0">
                <button
                  onClick={() => setActiveSection('users')}
                  className="py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left group w-full"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <LuUser className="h-4 w-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                    <span className="font-light text-black dark:text-white">Users</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage user accounts and roles
                  </p>
                </button>

                <div className="border-b border-gray-200 dark:border-gray-800"></div>

                <button
                  onClick={() => setActiveSection('role-requests')}
                  className="py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left group w-full"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <LuShield className="h-4 w-4 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                    <span className="font-light text-black dark:text-white">Role Requests</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Review role upgrade requests
                  </p>
                </button>
              </div>
            </div>
          </div>
        )
      case 'files':
        const paginatedPendingFiles = getPaginatedItems(pendingFiles, pendingFilesPage)
        const pendingFilesTotalPages = getTotalPages(pendingFiles.length)
        
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-light text-black dark:text-white">Pending Files</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{pendingFiles.length} files awaiting review</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchPendingFiles}
                disabled={loading}
                className="text-gray-500 hover:text-black dark:hover:text-white"
              >
                <LuRefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {message && (
              <div className={`text-center text-sm ${
                message.type === 'error' 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-green-600 dark:text-green-400'
              }`}>
                {message.text}
              </div>
            )}

            {pendingFiles.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <LuFileText className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
                <div>
                  <h3 className="text-lg font-light text-black dark:text-white mb-2">All caught up</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No files pending review</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {paginatedPendingFiles.map((file) => (
                  <div key={file.id} className="py-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <LuFileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <h3 className="font-medium text-black dark:text-white text-sm truncate">{file.original_name}</h3>
                          <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                            Pending
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <span>{file.profiles?.full_name || 'Anonymous'}</span>
                          <span>{formatDate(file.created_at)}</span>
                          <span className="capitalize">{file.category.replace('-', ' ')}</span>
                          <span>{formatFileSize(file.file_size)}</span>
                        </div>

                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {file.program.toUpperCase()} • {file.year.replace('-', ' ')} • {file.subject?.replace('-', ' ') || 'General'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFileAction(file.id, 'approve')}
                          disabled={actionLoading === file.id}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                        >
                          {actionLoading === file.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          ) : (
                            <LuCheck className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFileAction(file.id, 'reject')}
                          disabled={actionLoading === file.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          {actionLoading === file.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <LuX className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
                
                <Pagination
                  currentPage={pendingFilesPage}
                  totalPages={pendingFilesTotalPages}
                  onPageChange={setPendingFilesPage}
                  className="mt-6"
                />
              </>
            )}
          </div>
        )
      case 'all-files':
        const paginatedAllFiles = getPaginatedItems(allFiles, allFilesPage)
        const allFilesTotalPages = getTotalPages(allFiles.length)
        
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-light text-black dark:text-white">All Files</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{allFiles.length} live files</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchAllFiles}
                disabled={allFilesLoading}
                className="text-gray-500 hover:text-black dark:hover:text-white"
              >
                <LuRefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {allFilesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading files...</p>
              </div>
            ) : allFiles.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <LuFileText className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
                <div>
                  <h3 className="text-lg font-light text-black dark:text-white mb-2">No files found</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No approved files are live</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {paginatedAllFiles.map((file) => (
                  <div key={file.id} className="py-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <LuFileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <h3 className="font-medium text-black dark:text-white text-sm truncate">{file.original_name}</h3>
                          <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                            Live
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <span>{file.profiles?.full_name || 'Anonymous'}</span>
                          <span>{formatDate(file.created_at)}</span>
                          <span className="capitalize">{file.category.replace('-', ' ')}</span>
                          {file.file_size && <span>{formatFileSize(file.file_size)}</span>}
                        </div>

                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {file.program.toUpperCase()} • {file.year.replace('-', ' ')} • {file.subject?.replace('-', ' ') || 'General'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            let url = ''
                            if (file.year === '1st-year') {
                              url = `/notes/${file.program}/${file.year}/${file.subject}`
                            } else {
                              const fullBranchName = file.branch || 'computer-science-and-engineering'
                              const branchSlug = getBranchUrlSlug(fullBranchName)
                              url = `/notes/${file.program}/${branchSlug}/${file.year}/${file.subject}`
                            }
                            window.open(url, '_blank')
                          }}
                          className="text-gray-500 hover:text-black dark:hover:text-white"
                        >
                          <LuEye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
                
                <Pagination
                  currentPage={allFilesPage}
                  totalPages={allFilesTotalPages}
                  onPageChange={setAllFilesPage}
                  className="mt-6"
                />
              </>
            )}
          </div>
        )
      case 'reports':
        const paginatedReports = getPaginatedItems(reports, reportsPage)
        const reportsTotalPages = getTotalPages(reports.length)
        
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-light text-black dark:text-white">Reports</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{reports.length} pending reports</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchReports}
                disabled={reportsLoading}
                className="text-gray-500 hover:text-black dark:hover:text-white"
              >
                <LuRefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            {reportsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading reports...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <LuFlag className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
                <div>
                  <h3 className="text-lg font-light text-black dark:text-white mb-2">All clear</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No reports to review</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {paginatedReports.map((report) => (
                  <div key={report.id} className="py-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <LuFlag className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <h3 className="font-medium text-black dark:text-white text-sm truncate">{report.files.original_name}</h3>
                          <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                            {report.reason.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <span>By {report.profiles.full_name}</span>
                          <span>{formatDate(report.created_at)}</span>
                          <span className="capitalize">{report.files.category.replace('-', ' ')}</span>
                        </div>

                        {report.description && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            {report.description}
                          </div>
                        )}

                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {report.files.program.toUpperCase()} • {report.files.year.replace('-', ' ')} • {report.files.subject}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/notes/${report.files.program}/${report.files.year}/${report.files.subject}`, '_blank')}
                          className="text-gray-500 hover:text-black dark:hover:text-white"
                        >
                          <LuEye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReportAction(report.id, 'resolve')}
                          disabled={actionLoading === report.id}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                        >
                          {actionLoading === report.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          ) : (
                            <LuCheck className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReportAction(report.id, 'dismiss')}
                          disabled={actionLoading === report.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          {actionLoading === report.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <LuX className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
                
                <Pagination
                  currentPage={reportsPage}
                  totalPages={reportsTotalPages}
                  onPageChange={setReportsPage}
                  className="mt-6"
                />
              </>
            )}
          </div>
        )
      case 'subjects':
        return <SubjectRequestsAdmin />
      case 'users':
        return <UserManagement />
      case 'role-requests':
        return <RoleRequestsAdmin />
      default:
        return null
    }
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="hidden lg:block w-80 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-light text-black dark:text-white mb-8">Admin Panel</h1>
          
          {/* Content Management */}
          <div className="mb-8">
            <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Content Management
            </h2>
            <div className="space-y-1">
              <button
                onClick={() => setActiveSection('files')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  activeSection === 'files'
                    ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <LuFileText className="h-4 w-4" />
                Pending Files
                {pendingFiles.length > 0 && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                    {pendingFiles.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveSection('all-files')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  activeSection === 'all-files'
                    ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <LuEye className="h-4 w-4" />
                All Files
              </button>
              
              <button
                onClick={() => setActiveSection('reports')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  activeSection === 'reports'
                    ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <LuFlag className="h-4 w-4" />
                Reports
                {reports.length > 0 && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                    {reports.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveSection('subjects')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  activeSection === 'subjects'
                    ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <LuSettings className="h-4 w-4" />
                Subject Requests
              </button>
            </div>
          </div>

          {/* User Management */}
          <div>
            <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              User Management
            </h2>
            <div className="space-y-1">
              <button
                onClick={() => setActiveSection('users')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  activeSection === 'users'
                    ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <LuUser className="h-4 w-4" />
                Users
              </button>
              
              <button
                onClick={() => setActiveSection('role-requests')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  activeSection === 'role-requests'
                    ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <LuShield className="h-4 w-4" />
                Role Requests
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Navigation */}
        <div className="lg:hidden border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3 mb-4">
            {activeSection !== 'overview' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveSection('overview')}
                className="text-gray-500 hover:text-black dark:hover:text-white p-1"
              >
                <LuChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-xl font-light text-black dark:text-white">
              {activeSection === 'overview' ? 'Admin Panel' : getSectionTitle(activeSection)}
            </h1>
          </div>
        </div>

        <div className="p-4 lg:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}