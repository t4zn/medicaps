import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MBA Formula Sheets - Coming Soon',
  description: 'MBA formula sheets will be available soon.',
}

export default function MBAFormulaSheetsPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-4">MBA Formula Sheets</h1>
        <p className="text-muted-foreground">Coming Soon</p>
      </div>
    </div>
  )
}