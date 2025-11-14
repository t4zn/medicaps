/**
 * Download helper utility to handle file downloads without popup blockers
 */

export interface DownloadOptions {
  fileId: string
  userId?: string
  onStart?: () => void
  onSuccess?: (url: string) => void
  onError?: (error: string) => void
  onComplete?: () => void
}

/**
 * Handle file download with popup blocker prevention
 */
export async function handleFileDownload(options: DownloadOptions): Promise<void> {
  const { fileId, userId, onStart, onSuccess, onError, onComplete } = options
  
  // Call onStart callback
  onStart?.()
  
  // Open a new window immediately to avoid popup blockers
  const newWindow = window.open('', '_blank')
  
  try {
    // Track download and get download URL
    const response = await fetch(`/api/download/${fileId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })

    const data = await response.json()
    
    if (data.success && data.downloadUrl && data.downloadUrl !== 'null' && data.downloadUrl.trim() !== '') {
      // Navigate the pre-opened window to the download URL
      if (newWindow && !newWindow.closed) {
        newWindow.location.href = data.downloadUrl
        onSuccess?.(data.downloadUrl)
      } else {
        // Fallback: try direct navigation if popup was blocked
        window.location.href = data.downloadUrl
        onSuccess?.(data.downloadUrl)
      }
    } else {
      // Close the empty window if download failed
      if (newWindow && !newWindow.closed) {
        newWindow.close()
      }
      const errorMessage = data.error || 'Download link not available. Please contact support.'
      onError?.(errorMessage)
    }
  } catch (error) {
    // Close the empty window if there was an error
    if (newWindow && !newWindow.closed) {
      newWindow.close()
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to download file. Please try again.'
    onError?.(errorMessage)
  } finally {
    onComplete?.()
  }
}

/**
 * Handle direct download for files with known URLs (like in MyUploads)
 */
export function handleDirectDownload(url: string, fallbackError?: string): void {
  if (!url || url === 'null' || url.trim() === '') {
    alert(fallbackError || 'Download link not available.')
    return
  }
  
  // For direct downloads, we can use window.location.href to avoid popup blockers
  // This works better with ad blockers as well
  window.location.href = url
}

/**
 * Check if a URL is valid for downloading
 */
export function isValidDownloadUrl(url: string | null | undefined): boolean {
  return !!(url && url !== 'null' && url.trim() !== '')
}