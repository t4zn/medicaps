import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MBA Notes - Coming Soon',
  description: 'MBA study materials and notes will be available soon.',
}

export default function MBANotesPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-4">MBA Notes</h1>
        <p className="text-muted-foreground">Coming Soon</p>
      </div>
    </div>
  )
}