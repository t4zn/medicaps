import FileBrowser from '@/components/FileBrowser'

export default function BrowsePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Browse Study Materials</h1>
        <p className="text-muted-foreground">
          Find notes, previous year questions, and formula sheets for your program and subjects.
        </p>
      </div>
      
      <FileBrowser />
    </div>
  )
}