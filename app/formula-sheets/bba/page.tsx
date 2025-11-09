import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BBA Formula Sheets - Coming Soon',
  description: 'BBA formula sheets will be available soon.',
}

export default function BBAFormulaSheetsPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-4">BBA Formula Sheets</h1>
        <p className="text-muted-foreground">Coming Soon</p>
      </div>
    </div>
  )
}