import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'M.Tech Notes - Coming Soon',
  description: 'M.Tech study materials and notes will be available soon.',
}

export default function MTechNotesPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-4">M.Tech Notes</h1>
        <p className="text-muted-foreground">Coming Soon</p>
      </div>
    </div>
  )
}