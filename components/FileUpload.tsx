'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Documents } from '@/settings/documents'
import { Paths } from '@/lib/pageroutes'

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
  LuBot,
  LuLink,
  LuExternalLink
} from 'react-icons/lu'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Alert, AlertDescription } from './ui/alert'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface FileUploadProps {
  onUploadSuccess?: () => void
}

interface SubjectItem {
  value: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}



type Step = 'category' | 'program' | 'branch' | 'year' | 'subject' | 'file'

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

  const [googleDriveUrl, setGoogleDriveUrl] = useState('')
  const [filename, setFilename] = useState('')

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
  }, [formData])

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
    { key: 'file', title: 'Add your Google Drive link', required: true },
  ]

  const getCurrentStepIndex = () => steps.findIndex(step => step.key === currentStep)
  const isStepCompleted = (step: Step) => {
    switch (step) {
      case 'category': return !!formData.category
      case 'program': return !!formData.program
      case 'branch': return !!formData.branch || formData.year === '1st-year' // Branch not required for 1st year
      case 'year': return !!formData.year
      case 'subject': return !!formData.subject
      case 'file': return !!googleDriveUrl && !!filename
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

  const validateGoogleDriveUrl = (url: string) => {
    const googleDriveRegex = /^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view\?(usp=sharing|pli=1)$/
    return googleDriveRegex.test(url)
  }

  const handleUrlChange = (url: string) => {
    setGoogleDriveUrl(url)
    if (url && !validateGoogleDriveUrl(url)) {
      // Check if it looks like a Google Drive link but might be private
      if (url.includes('drive.google.com')) {
        setUploadStatus({
          type: 'error',
          message: 'Please make sure your Google Drive file is set to public and use the sharing link',
        })
      } else {
        setUploadStatus({
          type: 'error',
          message: 'Please provide a valid Google Drive sharing link',
        })
      }
    } else {
      setUploadStatus({ type: null, message: '' })
    }
  }

  const handleUpload = async () => {
    if (!googleDriveUrl || !filename || !user) return

    const { program, branch, year, subject, category } = formData

    // Validate Google Drive URL
    if (!validateGoogleDriveUrl(googleDriveUrl)) {
      if (googleDriveUrl.includes('drive.google.com')) {
        setUploadStatus({
          type: 'error',
          message: 'Please make sure your Google Drive file is public and use the sharing link',
        })
      } else {
        setUploadStatus({
          type: 'error',
          message: 'Please provide a valid Google Drive sharing link',
        })
      }
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
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleDriveUrl,
          filename,
          program,
          branch: branch || '',
          year,
          subject,
          category,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        setUploadStatus({
          type: 'error',
          message: errorData.error || 'Upload failed. Please try again.',
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
        const subjectUrl = subject && subject !== 'null' 
          ? `/notes/${program}/${year}/${subject}`
          : `/notes/${program}/${year}`
        
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
      
      setUploadStatus({
        type: 'error',
        message: 'Network error. Please try again.',
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
          <p className="text-muted-foreground">Please sign in to add file links.</p>
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
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Add File Link</h2>
            <p className="text-sm text-muted-foreground">
              {formData.program.toUpperCase()} • {formData.year.replace('-', ' ')} • {formData.subject.replace('-', ' ')} • {formData.category.replace('-', ' ')}
            </p>
          </div>

          {/* File Upload */}
          <div className="mb-6 space-y-4">
            <div>
              <Input
                placeholder="File name (e.g., Chapter 1 Notes.pdf)"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="h-12"
              />
            </div>
            
            <div>
              <Input
                placeholder="Google Drive sharing link"
                value={googleDriveUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="h-12"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Make sure your file is public and shareable
              </p>
            </div>

            {/* Quick Guide */}
            <div className="p-4 bg-muted/30 rounded-lg border">
              <h4 className="text-sm font-medium mb-2">Quick Guide:</h4>
              <ol className="text-xs text-muted-foreground space-y-1">
                <li>1. Upload your PDF to <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer" className="font-bold text-foreground hover:text-primary cursor-pointer">Google Drive</a></li>
                <li>2. Right-click → Share → Anyone with link</li>
                <li>3. Copy the link and paste above</li>
              </ol>
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
            disabled={uploading || !googleDriveUrl || !filename || !validateGoogleDriveUrl(googleDriveUrl)}
            className="w-full h-10 sm:h-12"
            size="lg"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding Link...
              </>
            ) : (
              <>
                <LuLink className="h-4 w-4 mr-2" />
                Add File Link
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
            <div className="space-y-4">
              <Input
                placeholder="File name (e.g., Chapter 1 Notes.pdf)"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="h-12"
              />
              
              <Input
                placeholder="Google Drive sharing link"
                value={googleDriveUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="h-12"
              />
              <p className="text-xs text-muted-foreground text-center">
                Make sure your file is public and shareable
              </p>
            </div>

            {/* Quick Guide */}
            <div className="p-4 bg-muted/30 rounded-lg border">
              <h4 className="text-sm font-medium mb-2 text-center">Quick Guide:</h4>
              <ol className="text-xs text-muted-foreground space-y-1 text-center">
                <li>1. Upload your PDF to <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer" className="font-bold text-foreground hover:text-primary cursor-pointer">Google Drive</a></li>
                <li>2. Right-click → Share → Anyone with link</li>
                <li>3. Copy the link and paste above</li>
              </ol>
            </div>

            {googleDriveUrl && filename && validateGoogleDriveUrl(googleDriveUrl) && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300 justify-center">
                  <LuCheck className="h-4 w-4" />
                  <span className="text-sm font-medium">Ready to add!</span>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={uploading || !googleDriveUrl || !filename || !validateGoogleDriveUrl(googleDriveUrl)}
              className="w-full h-12"
              size="lg"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding Link...
                </>
              ) : (
                <>
                  <LuLink className="h-4 w-4 mr-2" />
                  Add File Link
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
        {currentStep !== 'file' && (
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
              Next
              <LuArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {currentStep === 'file' && (
          <Button
            variant="outline"
            onClick={prevStep}
            className="w-full"
          >
            <LuArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
      </CardContent>
    </Card>
  )
}