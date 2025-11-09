'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { LuUpload, LuFile, LuCheck, LuX, LuArrowRight, LuArrowLeft } from 'react-icons/lu'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Alert, AlertDescription } from './ui/alert'

interface FileUploadProps {
  onUploadSuccess?: () => void
}

type Step = 'category' | 'program' | 'year' | 'subject' | 'file' | 'upload'

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState<Step>('category')
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

  const steps: { key: Step; title: string; required: boolean }[] = [
    { key: 'category', title: 'What type of material?', required: true },
    { key: 'program', title: 'Which program?', required: true },
    { key: 'year', title: 'Which year?', required: true },
    { key: 'subject', title: 'Which subject?', required: false },
    { key: 'file', title: 'Select your file', required: true },
    { key: 'upload', title: 'Ready to upload', required: false },
  ]

  const getCurrentStepIndex = () => steps.findIndex(step => step.key === currentStep)
  const isStepCompleted = (step: Step) => {
    switch (step) {
      case 'category': return !!formData.category
      case 'program': return !!formData.program
      case 'year': return !!formData.year
      case 'subject': return true // Optional step
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
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const handleUpload = async () => {
    if (!selectedFile || !user) return

    const { program, year, subject, category } = formData

    if (!program || !year || !category) {
      setUploadStatus({
        type: 'error',
        message: 'Please complete all required steps.',
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
        setCurrentStep('category')
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 'category':
        return (
          <div className="space-y-4">
            <div className="grid gap-3">
              {[
                { value: 'notes', label: '📝 Notes', desc: 'Class notes and study materials' },
                { value: 'pyqs', label: '📋 PYQs', desc: 'Previous year question papers' },
                { value: 'formula-sheet', label: '📊 Formula Sheet', desc: 'Quick reference formulas' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormData({ ...formData, category: option.value })}
                  className={`p-4 text-left border rounded-lg transition-colors hover:bg-muted/50 ${
                    formData.category === option.value ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
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
              <SelectContent>
                <SelectItem value="btech">🎓 B.Tech</SelectItem>
                <SelectItem value="bsc">🔬 B.Sc</SelectItem>
                <SelectItem value="bba">💼 BBA</SelectItem>
                <SelectItem value="bcom">💰 B.Com</SelectItem>
                <SelectItem value="mtech">🎯 M.Tech</SelectItem>
                <SelectItem value="mba">📈 MBA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      case 'year':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
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
                  className={`p-4 text-center border rounded-lg transition-colors hover:bg-muted/50 ${
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
        return (
          <div className="space-y-4">
            <Select
              value={formData.subject}
              onValueChange={(value: string) => setFormData({ ...formData, subject: value })}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choose subject (optional)" />
              </SelectTrigger>
              <SelectContent>
                {formData.program === 'btech' && formData.year === '1st-year' && (
                  <>
                    <SelectItem value="c-programming">💻 C Programming</SelectItem>
                    <SelectItem value="chemistry">🧪 Chemistry</SelectItem>
                    <SelectItem value="civil">🏗️ Civil</SelectItem>
                    <SelectItem value="communication-skills">🗣️ Communication Skills</SelectItem>
                    <SelectItem value="electrical">⚡ Electrical</SelectItem>
                    <SelectItem value="electronics">🔌 Electronics</SelectItem>
                    <SelectItem value="graphics">🎨 Graphics</SelectItem>
                    <SelectItem value="maths-1">📐 Maths I</SelectItem>
                    <SelectItem value="maths-2">📊 Maths II</SelectItem>
                    <SelectItem value="mechanical">⚙️ Mechanical</SelectItem>
                    <SelectItem value="physics">🔬 Physics</SelectItem>
                    <SelectItem value="workshop">🔧 Workshop</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground text-center">
              You can skip this step if your material covers multiple subjects
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
                <span className="text-muted-foreground">Year:</span>
                <span>{formData.year.replace('-', ' ')}</span>
              </div>
              {formData.subject && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subject:</span>
                  <span className="capitalize">{formData.subject.replace('-', ' ')}</span>
                </div>
              )}
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
      <CardContent className="p-6">
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
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">{currentStepData?.title}</h2>
        </div>

        {/* Step Content */}
        <div className="mb-6">
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
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentIndex === 0}
            >
              <LuArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={!canProceed() || currentIndex === steps.length - 1}
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