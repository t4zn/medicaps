'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Plus, 
  Settings as SettingsIcon, 
  User, 
  Bell,
  Shield,
  ChevronRight
} from 'lucide-react'

export default function SettingsPage() {
  const settingsOptions = [
    {
      title: 'Subject Requests',
      description: 'Request new subjects to be added to the curriculum',
      icon: Plus,
      href: '/settings/subject-requests',
      color: 'text-blue-600'
    },
    {
      title: 'Profile Settings',
      description: 'Manage your profile information and preferences',
      icon: User,
      href: '/profile',
      color: 'text-green-600'
    },
    {
      title: 'Notifications',
      description: 'Configure your notification preferences',
      icon: Bell,
      href: '/settings/notifications',
      color: 'text-yellow-600',
      disabled: true
    },
    {
      title: 'Privacy & Security',
      description: 'Manage your privacy settings and security options',
      icon: Shield,
      href: '/settings/privacy',
      color: 'text-red-600',
      disabled: true
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SimpleBreadcrumb items={[{ label: 'Settings' }]} homeHref="/welcome" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {settingsOptions.map((option) => {
          const IconComponent = option.icon
          
          if (option.disabled) {
            return (
              <Card key={option.title} className="opacity-50 cursor-not-allowed">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <IconComponent className={`h-5 w-5 ${option.color}`} />
                    {option.title}
                    <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Coming Soon
                    </span>
                  </CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          }

          return (
            <Link key={option.title} href={option.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <IconComponent className={`h-5 w-5 ${option.color}`} />
                    {option.title}
                    <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                  </CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1">
              <Link href="/settings/subject-requests">
                <Plus className="h-4 w-4 mr-2" />
                Request New Subject
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}