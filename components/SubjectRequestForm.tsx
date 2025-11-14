'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface SubjectRequestFormProps {
  onSuccess?: () => void
}

const BTECH_BRANCHES = [
  { value: 'cse', label: 'Computer Science & Engineering' },
  { value: 'cse-ai', label: 'CSE - Artificial Intelligence' },
  { value: 'cse-ds', label: 'CSE - Data Science' },
  { value: 'cse-networks', label: 'CSE - Networks' },
  { value: 'cse-ai-ml', label: 'CSE - AI & ML' },
  { value: 'cyber-security', label: 'Cyber Security' },
  { value: 'cse-iot', label: 'CSE - IoT' },
  { value: 'csbs', label: 'CSBS' },
  { value: 'ece', label: 'Electronics & Communication' },
  { value: 'civil', label: 'Civil Engineering' },
  { value: 'electrical', label: 'Electrical Engineering' },
  { value: 'automobile-ev', label: 'Automobile (EV)' },
  { value: 'it', label: 'Information Technology' },
  { value: 'mechanical', label: 'Mechanical Engineering' },
  { value: 'robotics-automation', label: 'Robotics & Automation' }
]

const YEARS = [
  { value: '1st-year', label: '1st Year' },
  { value: '2nd-year', label: '2nd Year' },
  { value: '3rd-year', label: '3rd Year' },
  { value: '4th-year', label: '4th Year' }
]

export function SubjectRequestForm({ onSuccess }: SubjectRequestFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    subject_name: '',
    subject_code: '',
    description: '',
    program: 'btech',
    branch: '',
    year: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to submit a request' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/subject-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, userId: user.id })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request')
      }

      setMessage({ type: 'success', text: data.message })
      setFormData({
        subject_name: '',
        subject_code: '',
        description: '',
        program: 'btech',
        branch: '',
        year: ''
      })
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to submit request' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const remainingChars = 150 - formData.description.length

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Subject Name *</label>
              <Input
                placeholder="e.g., Machine Learning"
                value={formData.subject_name}
                onChange={(e) => handleInputChange('subject_name', e.target.value)}
                required
                className="border-gray-200 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Subject Code *</label>
              <Input
                placeholder="e.g., CS301"
                value={formData.subject_code}
                onChange={(e) => handleInputChange('subject_code', e.target.value)}
                required
                className="border-gray-200 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Branch *</label>
              <Select value={formData.branch} onValueChange={(value) => handleInputChange('branch', value)}>
                <SelectTrigger className="border-gray-200 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-600">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {BTECH_BRANCHES.map((branch) => (
                    <SelectItem key={branch.value} value={branch.value}>
                      {branch.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Year *</label>
              <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
                <SelectTrigger className="border-gray-200 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-600">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Description *</label>
            <Textarea
              placeholder="Brief description of the subject (max 150 characters)"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              maxLength={150}
              rows={3}
              required
              className="border-gray-200 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-600 resize-none"
            />
            <div className="text-xs text-gray-500 text-right">
              {remainingChars} characters remaining
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg border ${message.type === 'error' 
              ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950' 
              : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
            }`}>
              <div className="flex items-center gap-2">
                {message.type === 'error' ? (
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                )}
                <span className={`text-sm ${message.type === 'error' 
                  ? 'text-red-800 dark:text-red-200' 
                  : 'text-green-800 dark:text-green-200'
                }`}>
                  {message.text}
                </span>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting || !formData.subject_name || !formData.subject_code || !formData.description || !formData.branch || !formData.year}
            className="w-full h-11 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900 text-white font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}