import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BBA Notes - Coming Soon',
  description: 'BBA study materials and notes will be available soon.',
}

export default function BBANotesPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-4">BBA Notes</h1>
        <p className="text-muted-foreground">Coming Soon</p>
      </div>
    </div>
  )
}