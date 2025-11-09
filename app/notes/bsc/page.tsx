import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'B.Sc Notes - Coming Soon',
  description: 'B.Sc study materials and notes will be available soon.',
}

export default function BScNotesPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-4">B.Sc Notes</h1>
        <p className="text-muted-foreground">Coming Soon</p>
      </div>
    </div>
  )
}