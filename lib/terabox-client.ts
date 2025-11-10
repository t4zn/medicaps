// Terabox API client for file storage
export class TeraboxClient {
  private apiKey: string
  private baseUrl: string = 'https://pan.baidu.com/api'
  
  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async uploadFile(file: File, path: string = '/medicaps-resources/'): Promise<TeraboxUploadResponse> {
    try {
      // Step 1: Get upload URL
      const uploadUrl = await this.getUploadUrl(file.name, path)
      
      // Step 2: Upload file to Terabox
      const formData = new FormData()
      formData.append('file', file)
      formData.append('path', path + file.name)
      
      const uploadResponse = await fetch(uploadUrl.upload_url, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      })
      
      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`)
      }
      
      const result = await uploadResponse.json()
      
      // Step 3: Get shareable link
      const shareLink = await this.createShareLink(result.fs_id)
      
      return {
        success: true,
        fileId: result.fs_id,
        fileName: file.name,
        fileSize: file.size,
        downloadUrl: shareLink.link,
        path: path + file.name
      }
      
    } catch (error) {
      console.error('Terabox upload error:', error)
      throw new Error(`Failed to upload to Terabox: ${error}`)
    }
  }

  private async getUploadUrl(fileName: string, path: string) {
    const response = await fetch(`${this.baseUrl}/precreate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: path + fileName,
        size: 0, // Will be updated during actual upload
        isdir: 0,
        rtype: 1
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to get upload URL')
    }
    
    return response.json()
  }

  private async createShareLink(fsId: string) {
    const response = await fetch(`${this.baseUrl}/share/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fid_list: [fsId],
        schannel: 4,
        channel_list: [],
        period: 0 // Permanent link
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to create share link')
    }
    
    return response.json()
  }

  async deleteFile(fsId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/filemanager`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          opera: 'delete',
          filelist: [fsId]
        })
      })
      
      return response.ok
    } catch (error) {
      console.error('Terabox delete error:', error)
      return false
    }
  }

  async getFileInfo(_fsId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/list`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to get file info')
      }
      
      return response.json()
    } catch (error) {
      console.error('Terabox file info error:', error)
      throw error
    }
  }
}

export interface TeraboxUploadResponse {
  success: boolean
  fileId: string
  fileName: string
  fileSize: number
  downloadUrl: string
  path: string
}

// Initialize Terabox client
export const teraboxClient = new TeraboxClient(process.env.TERABOX_API_KEY || '')