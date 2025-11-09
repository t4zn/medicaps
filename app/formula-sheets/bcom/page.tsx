import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'B.Com Formula Sheets - Coming Soon',
  description: 'B.Com formula sheets will be available soon.',
}

export default function BComFormulaSheetsPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-4">B.Com Formula Sheets</h1>
        <p className="text-muted-foreground">Coming Soon</p>
      </div>
    </div>
  )
}