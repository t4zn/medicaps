import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BBA PYQs - Coming Soon',
  description: 'BBA previous year questions will be available soon.',
}

export default function BBAPYQsPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-4">BBA PYQs</h1>
        <p className="text-muted-foreground">Coming Soon</p>
      </div>
    </div>
  )
}