'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SimpleBreadcrumb } from '@/components/ui/breadcrumb'
import { SubjectRequestForm } from '@/components/SubjectRequestForm'
import { MySubjectRequests } from '@/components/MySubjectRequests'

export default function SubjectRequestsPage() {
  const [activeTab, setActiveTab] = useState('request')

  const handleRequestSuccess = () => {
    setActiveTab('my-requests')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SimpleBreadcrumb 
        items={[
          { label: 'Settings', href: '/settings' },
          { label: 'Subject Requests' }
        ]} 
        homeHref="/welcome" 
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subject Requests</h1>
        <p className="text-muted-foreground">
          Request new subjects to be added to the B.Tech curriculum
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="request">New Request</TabsTrigger>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="request" className="space-y-6">
          <SubjectRequestForm onSuccess={handleRequestSuccess} />
        </TabsContent>
        
        <TabsContent value="my-requests" className="space-y-6">
          <MySubjectRequests />
        </TabsContent>
      </Tabs>
    </div>
  )
}