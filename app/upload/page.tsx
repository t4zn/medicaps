import FileUpload from '@/components/FileUpload'

export default function UploadPage() {
  return (
    <div className="container mx-auto py-4 sm:py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Upload Study Material</h1>
          <p className="text-sm sm:text-base text-muted-foreground px-4 sm:px-0">
            Share your notes, PYQs, and formula sheets with fellow Medicaps University students.
            All uploads require admin approval before being published.
          </p>
        </div>
        
        <FileUpload />
      </div>
    </div>
  )
}