import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'B.Sc PYQs - Coming Soon',
  description: 'B.Sc previous year questions will be available soon.',
}

export default function BScPYQsPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-4">B.Sc PYQs</h1>
        <p className="text-muted-foreground">Coming Soon</p>
      </div>
    </div>
  )
}