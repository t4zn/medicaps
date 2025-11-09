import FileUpload from '@/components/FileUpload'

export default function UploadPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Upload Study Material</h1>
          <p className="text-muted-foreground">
            Share your notes, PYQs, and formula sheets with fellow Medicaps University students.
            All uploads require admin approval before being published.
          </p>
        </div>
        
        <FileUpload />
      </div>
    </div>
  )
}