'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Documents } from '@/settings/documents'
import { Paths } from '@/lib/pageroutes'
import { useDropzone, FileRejection } from 'react-dropzone'
import { 
  LuUpload, 
  LuCheck, 
  LuX, 
  LuArrowRight, 
  LuArrowLeft,
  LuFileText,
  LuClipboardList,
  LuCalculator,
  LuGraduationCap,
  LuBeaker,
  LuBriefcase,
  LuDollarSign,
  LuTarget,
  LuTrendingUp,
  LuCode,
  LuAtom,
  LuHammer,
  LuMessageSquare,
  LuZap,
  LuCpu,
  LuPalette,
  LuSquare,
  LuCog,
  LuMicroscope,
  LuWrench,
  LuBrain,
  LuDatabase,
  LuNetwork,
  LuShield,
  LuWifi,
  LuBuilding,
  LuCar,
  LuServer,
  LuBot
} from 'react-icons/lu'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Alert, AlertDescription } from './ui/alert'

interface FileUploadProps {
  onUploadSuccess?: () => void
}

interface SubjectItem {
  value: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}



type Step = 'category' | 'program' | 'branch' | 'year' | 'subject' | 'file' | 'upload'

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState<Step>('category')
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const [formData, setFormData] = useState({
    program: '',
    branch: '',
    year: '',
    subject: '',
    category: '',
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Function to get icon for a subject based on its name/type
  const getSubjectIcon = (subjectName: string) => {
    const name = subjectName.toLowerCase()
    if (name.includes('programming') || name.includes('java') || name.includes('python') || name.includes('oop')) return LuCode
    if (name.includes('mathematics') || name.includes('maths')) return LuSquare
    if (name.includes('communication') || name.includes('data comm')) return LuNetwork
    if (name.includes('database') || name.includes('dbms')) return LuDatabase
    if (name.includes('electronics') || name.includes('digital')) return LuCpu
    if (name.includes('architecture') || name.includes('computer')) return LuServer
    if (name.includes('skills') || name.includes('communication')) return LuMessageSquare
    if (name.includes('ai') || name.includes('artificial') || name.includes('ml') || name.includes('machine learning') || name.includes('algorithm')) return LuBrain
    if (name.includes('operating') || name.includes('systems')) return LuServer
    if (name.includes('theory')) return LuBrain
    if (name.includes('microprocessor')) return LuCpu
    if (name.includes('software') || name.includes('compiler')) return LuCode
    if (name.includes('networks')) return LuNetwork
    if (name.includes('economics')) return LuDollarSign
    if (name.includes('research')) return LuMicroscope
    if (name.includes('industrial') || name.includes('training')) return LuBriefcase
    if (name.includes('chemistry')) return LuAtom
    if (name.includes('physics')) return LuAtom
    if (name.includes('electrical')) return LuZap
    if (name.includes('civil')) return LuHammer
    if (name.includes('mechanical')) return LuCog
    if (name.includes('graphics')) return LuPalette
    if (name.includes('workshop')) return LuWrench
    return LuFileText // Default icon
  }

  // Function to extract subject slug from href
  const extractSubjectSlug = (href: string) => {
    const parts = href.split('/')
    return parts[parts.length - 1] // Get the last part of the URL
  }

  // Function to get subjects dynamically from sidebar structure
  const getSubjectsForSelection = useMemo((): SubjectItem[] => {
    const { program, branch, year } = formData
    
    if (program !== 'btech') return []
    
    // Find the B.Tech section in Documents
    const rootSection = Documents[0]
    if (!rootSection || !('items' in rootSection) || !rootSection.items) return []
    
    const btechSection = rootSection.items.find((item: Paths) => 'title' in item && item.title === 'B.Tech')
    if (!btechSection || !('items' in btechSection) || !btechSection.items) return []
    
    // Handle 1st year (common for all branches)
    if (year === '1st-year') {
      const firstYearSection = btechSection.items.find((item: Paths) => 'title' in item && item.title === '1st Year')
      if (firstYearSection && 'items' in firstYearSection && firstYearSection.items) {
        return firstYearSection.items.filter((item: Paths): item is Extract<Paths, { title: string; href: string }> => 'title' in item && 'href' in item).map((subject) => ({
          value: extractSubjectSlug(subject.href),
          label: subject.title,
          icon: getSubjectIcon(subject.title)
        }))
      }
      return []
    }
    
    // Handle other years - find the specific branch
    let branchSection = null
    
    // Map branch values to sidebar titles
    const branchMapping: Record<string, string> = {
      'computer-science-and-engineering': 'CSE',
      'cse-artificial-intelligence': 'CSE - AI',
      'cse-data-science': 'CSE - DS',
      'cse-networks': 'CSE - Networks',
      'cse-artificial-intelligence-and-machine-learning': 'CSE - AI & ML',
      'cse-cyber-security': 'Cyber Security',
      'cse-internet-of-things': 'CSE - IoT',
      'csbs-computer-science-and-business-systems': 'CSBS',
      'ece-electronics-communication-engineering': 'ECE',
      'ce-civil-engineering': 'Civil',
      'ee-electrical-engineering': 'Electrical',
      'mechanical-engineering': 'Mechanical',
      'au-ev-automobile-engineering-electric-vehicle': 'Automobile (EV)',
      'it-information-technology': 'IT',
      'ra-robotics-and-automation': 'Robotics & Automation'
    }
    
    const branchTitle = branchMapping[branch]
    if (!branchTitle) return []
    
    branchSection = btechSection.items.find((item: Paths) => 'title' in item && item.title === branchTitle)
    if (!branchSection || !('items' in branchSection) || !branchSection.items) return []
    
    // Find the specific year within the branch
    const yearMapping: Record<string, string> = {
      '2nd-year': '2nd Year',
      '3rd-year': '3rd Year', 
      '4th-year': '4th Year'
    }
    
    const yearTitle = yearMapping[year]
    if (!yearTitle) return []
    
    const yearSection = branchSection.items.find((item: Paths) => 'title' in item && item.title === yearTitle)
    
    // If year section has individual subject items, return them
    if (yearSection && 'items' in yearSection && yearSection.items && yearSection.items.length > 0) {
      return yearSection.items.filter((item: Paths): item is Extract<Paths, { title: string; href: string }> => 'title' in item && 'href' in item).map((subject) => ({
        value: extractSubjectSlug(subject.href),
        label: subject.title,
        icon: getSubjectIcon(subject.title)
      }))
    }
    
    // If year section exists but has no items (just a link), return empty array
    return []
  }, [formData.program, formData.branch, formData.year])

  // Check if coming from subject page (has pre-filled parameters)
  const isFromSubjectPage = searchParams.get('program') && searchParams.get('year') && searchParams.get('subject') && searchParams.get('category')

  // Auto-populate form data from URL parameters and skip to file step if all required fields are filled
  useEffect(() => {
    const program = searchParams.get('program')
    const branch = searchParams.get('branch')
    const year = searchParams.get('year')
    const subject = searchParams.get('subject')
    const category = searchParams.get('category')

    if (program || branch || year || subject || category) {
      const newFormData = {
        program: program || '',
        branch: branch || '',
        year: year || '',
        subject: subject || '',
        category: category || '',
      }
      
      setFormData(prev => ({
        ...prev,
        ...newFormData,
      }))

      // If all required fields are filled from URL params, skip to file step
      if (program && year && subject && category) {
        setCurrentStep('file')
      }
    }
  }, [searchParams])

  // Reset subject when branch or year changes (but not when coming from subject page)
  useEffect(() => {
    if (formData.subject && !isFromSubjectPage) {
      const isSubjectAvailable = getSubjectsForSelection.some((s: SubjectItem) => s.value === formData.subject)
      if (!isSubjectAvailable) {
        setFormData(prev => ({ ...prev, subject: '' }))
      }
    }
  }, [formData.subject, getSubjectsForSelection, isFromSubjectPage])

  const steps: { key: Step; title: string; required: boolean }[] = [
    { key: 'category', title: 'What type of material?', required: true },
    { key: 'program', title: 'Which program?', required: true },
    { key: 'branch', title: 'Which branch?', required: true },
    { key: 'year', title: 'Which year?', required: true },
    { key: 'subject', title: 'Which subject?', required: true },
    { key: 'file', title: 'Select your file', required: true },
    { key: 'upload', title: 'Ready to upload', required: false },
  ]

  const getCurrentStepIndex = () => steps.findIndex(step => step.key === currentStep)
  const isStepCompleted = (step: Step) => {
    switch (step) {
      case 'category': return !!formData.category
      case 'program': return !!formData.program
      case 'branch': return !!formData.branch || formData.year === '1st-year' // Branch not required for 1st year
      case 'year': return !!formData.year
      case 'subject': return !!formData.subject
      case 'file': return !!selectedFile
      case 'upload': return false
      default: return false
    }
  }

  const canProceed = () => {
    const currentStepData = steps.find(step => step.key === currentStep)
    if (!currentStepData) return false
    return !currentStepData.required || isStepCompleted(currentStep)
  }

  const nextStep = () => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].key)
    }
  }

  const prevStep = () => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].key)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    // Handle rejected files first
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors.some((e) => e.code === 'file-too-large')) {
        setUploadStatus({
          type: 'error',
          message: 'File too large. Please select a file smaller than 50MB.',
        })
        return
      }
      if (rejection.errors.some((e) => e.code === 'file-invalid-type')) {
        setUploadStatus({
          type: 'error',
          message: 'Please select a PDF file only.',
        })
        return
      }
    }

    const file = acceptedFiles[0]
    if (file && file.type === 'application/pdf') {
      // Double-check file size on mobile (sometimes dropzone doesn't catch it)
      if (file.size > 50 * 1024 * 1024) {
        setUploadStatus({
          type: 'error',
          message: 'File too large. Please select a file smaller than 50MB.',
        })
        return
      }
      
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
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const handleUpload = async () => {
    if (!selectedFile || !user) return

    const { program, branch, year, subject, category } = formData

    // Additional mobile-friendly validations
    if (selectedFile.size > 50 * 1024 * 1024) {
      setUploadStatus({
        type: 'error',
        message: 'File size must be less than 50MB.',
      })
      return
    }

    if (selectedFile.type !== 'application/pdf') {
      setUploadStatus({
        type: 'error',
        message: 'Only PDF files are allowed.',
      })
      return
    }

    // When coming from subject page, we only need the basic fields
    if (isFromSubjectPage) {
      // For subject page uploads, only validate essential fields (check for both empty string and undefined)
      if (!program?.trim() || !year?.trim() || !subject?.trim() || !category?.trim()) {
        setUploadStatus({
          type: 'error',
          message: 'Please complete all required steps.',
        })
        return
      }
    } else {
      // For step-by-step flow, validate all required fields including branch for non-1st-year
      if (!program?.trim() || !year?.trim() || !subject?.trim() || !category?.trim() || (year !== '1st-year' && !branch?.trim())) {
        setUploadStatus({
          type: 'error',
          message: 'Please complete all required steps.',
        })
        return
      }
    }

    setUploading(true)
    setUploadStatus({ type: null, message: '' })

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', selectedFile)
      uploadFormData.append('program', program)
      uploadFormData.append('branch', branch || '') // Handle empty branch
      uploadFormData.append('year', year)
      uploadFormData.append('subject', subject)
      uploadFormData.append('category', category)
      uploadFormData.append('userId', user.id)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 120000) // 2 minute timeout for mobile

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        // Handle HTTP errors with specific messages
        let errorMessage = 'Upload failed. Please try again.'
        
        if (response.status === 413) {
          errorMessage = 'File too large. Please select a file smaller than 50MB or try compressing your PDF.'
        } else if (response.status === 408) {
          errorMessage = 'Upload timeout. Please check your internet connection and try again.'
        } else if (response.status === 400) {
          const errorData = await response.json().catch(() => ({}))
          errorMessage = errorData.error || 'Invalid file or missing information.'
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again in a few moments.'
        }
        
        console.error('Upload HTTP error:', response.status)
        setUploadStatus({
          type: 'error',
          message: errorMessage,
        })
        return
      }

      const result = await response.json()

      if (result.success) {
        setUploadStatus({
          type: 'success',
          message: result.message,
        })
        
        // Always redirect to notes page after successful upload (user can switch tabs there)
        const subjectUrl = `/notes/${program}/${year}/${subject}`
        
        // Show success message briefly then redirect
        setTimeout(() => {
          router.push(subjectUrl)
        }, 1500)
        
        onUploadSuccess?.()
      } else {
        setUploadStatus({
          type: 'error',
          message: result.error || 'Upload failed',
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      
      // Provide more specific error messages
      let errorMessage = 'Network error. Please try again.'
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Upload timeout. Please check your connection and try again.'
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Connection failed. Check your internet connection.'
        } else {
          errorMessage = `Upload error: ${error.message}`
        }
      }
      
      setUploadStatus({
        type: 'error',
        message: errorMessage,
      })
    } finally {
      setUploading(false)
    }
  }

  if (!user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <LuUpload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Please sign in to upload files.</p>
        </CardContent>
      </Card>
    )
  }

  // If coming from subject page, show simplified upload interface
  if (isFromSubjectPage) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="p-4 sm:p-6">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold">Upload File</h2>
            <div className="mt-2 space-y-1 text-xs sm:text-sm text-muted-foreground">
              <div>Program: <span className="font-medium uppercase">{formData.program}</span></div>
              <div>Branch: <span className="font-medium capitalize">{formData.branch.replace('-', ' ')}</span></div>
              <div>Year: <span className="font-medium">{formData.year.replace('-', ' ')}</span></div>
              <div>Subject: <span className="font-medium capitalize">{formData.subject.replace('-', ' ')}</span></div>
              <div>Type: <span className="font-medium capitalize">{formData.category.replace('-', ' ')}</span></div>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-4 sm:mb-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              {selectedFile ? (
                <div className="space-y-3">
                  <LuCheck className="h-12 w-12 mx-auto text-green-500" />
                  <div>
                    <div className="font-medium">{selectedFile.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFile(null)
                    }}
                  >
                    <LuX className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <LuUpload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {isDragActive ? 'Drop your PDF here' : 'Upload your PDF file'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Drag & drop or click to browse • Max 50MB
                      <br />
                      <span className="text-xs">Tip: Compress large PDFs for faster upload</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Messages */}
          {uploadStatus.type && (
            <Alert variant={uploadStatus.type === 'error' ? 'destructive' : 'default'} className="mb-4">
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
            disabled={uploading || !selectedFile}
            className="w-full h-10 sm:h-12"
            size="lg"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <LuUpload className="h-4 w-4 mr-2" />
                Upload File
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'category':
        return (
          <div className="space-y-4">
            <div className="grid gap-3">
              {[
                { 
                  value: 'notes', 
                  label: 'Notes', 
                  desc: 'Class notes and study materials',
                  icon: LuFileText
                },
                { 
                  value: 'pyqs', 
                  label: 'PYQs', 
                  desc: 'Previous year question papers',
                  icon: LuClipboardList
                },
                { 
                  value: 'formula-sheet', 
                  label: 'Formula Sheet', 
                  desc: 'Quick reference formulas',
                  icon: LuCalculator
                },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormData({ ...formData, category: option.value })}
                  className={`p-3 sm:p-4 text-left border rounded-lg transition-colors hover:bg-muted/50 ${
                    formData.category === option.value ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <option.icon className="h-5 w-5 text-primary" />
                    <div className="font-medium">{option.label}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 'program':
        return (
          <div className="space-y-4">
            <Select
              value={formData.program}
              onValueChange={(value: string) => setFormData({ ...formData, program: value })}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choose your program" />
              </SelectTrigger>
              <SelectContent 
                position="popper" 
                sideOffset={4}
                align="start"
                className="max-h-[200px] overflow-y-auto w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)]"
              >
                <SelectItem value="btech">
                  <div className="flex items-center gap-2">
                    <LuGraduationCap className="h-4 w-4" />
                    B.Tech
                  </div>
                </SelectItem>
                <SelectItem value="bsc" disabled>
                  <div className="flex items-center gap-2 opacity-50">
                    <LuBeaker className="h-4 w-4" />
                    B.Sc (Coming Soon)
                  </div>
                </SelectItem>
                <SelectItem value="bba" disabled>
                  <div className="flex items-center gap-2 opacity-50">
                    <LuBriefcase className="h-4 w-4" />
                    BBA (Coming Soon)
                  </div>
                </SelectItem>
                <SelectItem value="bcom" disabled>
                  <div className="flex items-center gap-2 opacity-50">
                    <LuDollarSign className="h-4 w-4" />
                    B.Com (Coming Soon)
                  </div>
                </SelectItem>
                <SelectItem value="mtech" disabled>
                  <div className="flex items-center gap-2 opacity-50">
                    <LuTarget className="h-4 w-4" />
                    M.Tech (Coming Soon)
                  </div>
                </SelectItem>
                <SelectItem value="mba" disabled>
                  <div className="flex items-center gap-2 opacity-50">
                    <LuTrendingUp className="h-4 w-4" />
                    MBA (Coming Soon)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      case 'branch':
        return (
          <div className="space-y-4">
            {formData.program === 'btech' ? (
              <Select
                value={formData.branch}
                onValueChange={(value: string) => setFormData({ ...formData, branch: value })}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose your branch" />
                </SelectTrigger>
                <SelectContent 
                  position="popper" 
                  sideOffset={4}
                  align="start"
                  className="max-h-[200px] overflow-y-auto w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)]"
                >
                  <SelectItem value="computer-science-and-engineering">
                    <div className="flex items-center gap-2">
                      <LuCode className="h-4 w-4" />
                      CSE
                    </div>
                  </SelectItem>
                  <SelectItem value="cse-artificial-intelligence">
                    <div className="flex items-center gap-2">
                      <LuBrain className="h-4 w-4" />
                      CSE - AI
                    </div>
                  </SelectItem>
                  <SelectItem value="cse-data-science">
                    <div className="flex items-center gap-2">
                      <LuDatabase className="h-4 w-4" />
                      CSE - DS
                    </div>
                  </SelectItem>
                  <SelectItem value="cse-networks">
                    <div className="flex items-center gap-2">
                      <LuNetwork className="h-4 w-4" />
                      CSE - Networks
                    </div>
                  </SelectItem>
                  <SelectItem value="cse-artificial-intelligence-and-machine-learning">
                    <div className="flex items-center gap-2">
                      <LuBot className="h-4 w-4" />
                      CSE - AI & ML
                    </div>
                  </SelectItem>
                  <SelectItem value="cse-cyber-security">
                    <div className="flex items-center gap-2">
                      <LuShield className="h-4 w-4" />
                      Cyber Security
                    </div>
                  </SelectItem>
                  <SelectItem value="cse-internet-of-things">
                    <div className="flex items-center gap-2">
                      <LuWifi className="h-4 w-4" />
                      CSE - IoT
                    </div>
                  </SelectItem>
                  <SelectItem value="csbs-computer-science-and-business-systems">
                    <div className="flex items-center gap-2">
                      <LuBuilding className="h-4 w-4" />
                      CSBS
                    </div>
                  </SelectItem>
                  <SelectItem value="ece-electronics-communication-engineering">
                    <div className="flex items-center gap-2">
                      <LuCpu className="h-4 w-4" />
                      ECE
                    </div>
                  </SelectItem>
                  <SelectItem value="ce-civil-engineering">
                    <div className="flex items-center gap-2">
                      <LuHammer className="h-4 w-4" />
                      Civil
                    </div>
                  </SelectItem>
                  <SelectItem value="ee-electrical-engineering">
                    <div className="flex items-center gap-2">
                      <LuZap className="h-4 w-4" />
                      Electrical
                    </div>
                  </SelectItem>
                  <SelectItem value="au-ev-automobile-engineering-electric-vehicle">
                    <div className="flex items-center gap-2">
                      <LuCar className="h-4 w-4" />
                      Automobile (EV)
                    </div>
                  </SelectItem>
                  <SelectItem value="it-information-technology">
                    <div className="flex items-center gap-2">
                      <LuServer className="h-4 w-4" />
                      IT
                    </div>
                  </SelectItem>
                  <SelectItem value="mechanical-engineering">
                    <div className="flex items-center gap-2">
                      <LuCog className="h-4 w-4" />
                      Mechanical
                    </div>
                  </SelectItem>
                  <SelectItem value="ra-robotics-and-automation">
                    <div className="flex items-center gap-2">
                      <LuBot className="h-4 w-4" />
                      Robotics & Automation
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Please select B.Tech program first</p>
              </div>
            )}
          </div>
        )

      case 'year':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { value: '1st-year', label: '1st Year' },
                { value: '2nd-year', label: '2nd Year' },
                { value: '3rd-year', label: '3rd Year' },
                ...(formData.program === 'btech' || formData.program === 'bcom' 
                  ? [{ value: '4th-year', label: '4th Year' }] 
                  : []
                ),
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormData({ ...formData, year: option.value })}
                  className={`p-3 sm:p-4 text-center border rounded-lg transition-colors hover:bg-muted/50 ${
                    formData.year === option.value ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 'subject':
        const availableSubjects = getSubjectsForSelection
        return (
          <div className="space-y-4">
            <Select
              value={formData.subject}
              onValueChange={(value: string) => setFormData({ ...formData, subject: value })}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choose subject" />
              </SelectTrigger>
              <SelectContent 
                position="popper" 
                sideOffset={4}
                align="start"
                className="max-h-[200px] overflow-y-auto w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)]"
              >
                {availableSubjects.length > 0 ? (
                  availableSubjects.map((subject: SubjectItem) => (
                    <SelectItem key={subject.value} value={subject.value}>
                      <div className="flex items-center gap-2">
                        <subject.icon className="h-4 w-4" />
                        {subject.label}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-subjects" disabled>
                    <div className="flex items-center gap-2 opacity-50">
                      <LuFileText className="h-4 w-4" />
                      No subjects available for {formData.branch?.replace(/-/g, ' ').toUpperCase()} - {formData.year?.replace('-', ' ')}
                    </div>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground text-center">
              Select the specific subject for your material
            </p>
          </div>
        )

      case 'file':
        return (
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              {selectedFile ? (
                <div className="space-y-3">
                  <LuCheck className="h-12 w-12 mx-auto text-green-500" />
                  <div>
                    <div className="font-medium">{selectedFile.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFile(null)
                    }}
                  >
                    <LuX className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <LuUpload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {isDragActive ? 'Drop your PDF here' : 'Upload your PDF file'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Drag & drop or click to browse • Max 50MB
                      <br />
                      <span className="text-xs">Tip: Compress large PDFs for faster upload</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 'upload':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <LuCheck className="h-16 w-16 mx-auto text-green-500" />
              <div>
                <h3 className="text-lg font-semibold">Ready to Upload!</h3>
                <p className="text-muted-foreground">Review your details below</p>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="capitalize">{formData.category.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Program:</span>
                <span className="uppercase">{formData.program}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Branch:</span>
                <span className="capitalize">{formData.branch.replace(/-/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Year:</span>
                <span>{formData.year.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subject:</span>
                <span className="capitalize">{formData.subject.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">File:</span>
                <span className="truncate max-w-32">{selectedFile?.name}</span>
              </div>
            </div>

            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full h-12"
              size="lg"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <LuUpload className="h-4 w-4 mr-2" />
                  Upload File
                </>
              )}
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  const currentStepData = steps.find(step => step.key === currentStep)
  const currentIndex = getCurrentStepIndex()

  return (
    <Card className="max-w-lg mx-auto">
      <CardContent className="p-4 sm:p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Step {currentIndex + 1} of {steps.length}</span>
            <span>{Math.round(((currentIndex + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Title */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">{currentStepData?.title}</h2>
        </div>

        {/* Step Content */}
        <div className="mb-4 sm:mb-6">
          {renderStepContent()}
        </div>

        {/* Status Messages */}
        {uploadStatus.type && (
          <Alert variant={uploadStatus.type === 'error' ? 'destructive' : 'default'} className="mb-4">
            {uploadStatus.type === 'success' ? (
              <LuCheck className="h-4 w-4" />
            ) : (
              <LuX className="h-4 w-4" />
            )}
            <AlertDescription>{uploadStatus.message}</AlertDescription>
          </Alert>
        )}

        {/* Navigation */}
        {currentStep !== 'upload' && (
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentIndex === 0}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              <LuArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={!canProceed() || currentIndex === steps.length - 1}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {currentIndex === steps.length - 2 ? 'Review' : 'Next'}
              <LuArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {currentStep === 'upload' && (
          <Button
            variant="outline"
            onClick={prevStep}
            className="w-full"
          >
            <LuArrowLeft className="h-4 w-4 mr-2" />
            Back to Edit
          </Button>
        )}
      </CardContent>
    </Card>
  )
}