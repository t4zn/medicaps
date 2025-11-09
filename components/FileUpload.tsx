'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { LuUpload, LuFile, LuCheck, LuX } from 'react-icons/lu'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'

interface FileUploadProps {
  onUploadSuccess?: () => void
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const [formData, setFormData] = useState({
    program: '',
    year: '',
    subject: '',
    category: '',
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
      setUploadStatus({ type: null, message: '' })
    } else {
      setUploadStatus({
        type: 'error',
        message: 'Please select a PDF file only.',
      })
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const handleUpload = async () => {
    if (!selectedFile || !user) return

    const { program, year, subject, category } = formData

    if (!program || !year || !category) {
      setUploadStatus({
        type: 'error',
        message: 'Please fill in all required fields.',
      })
      return
    }

    setUploading(true)
    setUploadStatus({ type: null, message: '' })

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', selectedFile)
      uploadFormData.append('program', program)
      uploadFormData.append('year', year)
      uploadFormData.append('subject', subject)
      uploadFormData.append('category', category)
      uploadFormData.append('userId', user.id)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const result = await response.json()

      if (result.success) {
        setUploadStatus({
          type: 'success',
          message: result.message,
        })
        setSelectedFile(null)
        setFormData({ program: '', year: '', subject: '', category: '' })
        onUploadSuccess?.()
      } else {
        setUploadStatus({
          type: 'error',
          message: result.error || 'Upload failed',
        })
      }
    } catch {
      setUploadStatus({
        type: 'error',
        message: 'Network error. Please try again.',
      })
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setUploadStatus({ type: null, message: '' })
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please sign in to upload files.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LuUpload className="h-5 w-5" />
          Upload Study Material
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value: string) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="notes">Notes</SelectItem>
                <SelectItem value="pyqs">PYQs</SelectItem>
                <SelectItem value="formula-sheet">Formula Sheet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="program">Program *</Label>
            <Select
              value={formData.program}
              onValueChange={(value: string) =>
                setFormData({ ...formData, program: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="btech">B.Tech</SelectItem>
                <SelectItem value="bsc">B.Sc</SelectItem>
                <SelectItem value="bba">BBA</SelectItem>
                <SelectItem value="bcom">B.Com</SelectItem>
                <SelectItem value="mtech">M.Tech</SelectItem>
                <SelectItem value="mba">MBA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="year">Year *</Label>
            <Select
              value={formData.year}
              onValueChange={(value: string) =>
                setFormData({ ...formData, year: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1st-year">1st Year</SelectItem>
                <SelectItem value="2nd-year">2nd Year</SelectItem>
                <SelectItem value="3rd-year">3rd Year</SelectItem>
                {(formData.program === 'btech' || formData.program === 'bcom') && (
                  <SelectItem value="4th-year">4th Year</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={formData.subject}
              onValueChange={(value: string) =>
                setFormData({ ...formData, subject: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject (optional)" />
              </SelectTrigger>
              <SelectContent>
                {formData.program === 'btech' && formData.year === '1st-year' && (
                  <>
                    <SelectItem value="c-programming">C Programming</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="civil">Civil</SelectItem>
                    <SelectItem value="communication-skills">Communication Skills</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="graphics">Graphics</SelectItem>
                    <SelectItem value="maths-1">Maths I</SelectItem>
                    <SelectItem value="maths-2">Maths II</SelectItem>
                    <SelectItem value="mechanical">Mechanical</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* File Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LuFile className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile()
                }}
              >
                <LuX className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div>
              <LuUpload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isDragActive
                  ? 'Drop the PDF file here...'
                  : 'Drag & drop a PDF file here, or click to select'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Maximum file size: 10MB
              </p>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {uploadStatus.type && (
          <Alert variant={uploadStatus.type === 'error' ? 'destructive' : 'default'}>
            {uploadStatus.type === 'success' ? (
              <LuCheck className="h-4 w-4" />
            ) : (
              <LuX className="h-4 w-4" />
            )}
            <AlertDescription>{uploadStatus.message}</AlertDescription>
          </Alert>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploading || !formData.program || !formData.year || !formData.category}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </CardContent>
    </Card>
  )
}