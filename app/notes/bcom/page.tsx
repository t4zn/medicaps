import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'B.Com Notes - Coming Soon',
  description: 'B.Com study materials and notes will be available soon.',
}

export default function BComNotesPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-4">B.Com Notes</h1>
        <p className="text-muted-foreground">Coming Soon</p>
      </div>
    </div>
  )
}