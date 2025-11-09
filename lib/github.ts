import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const GITHUB_OWNER = process.env.GITHUB_OWNER!
const GITHUB_REPO = process.env.GITHUB_REPO!

export interface UploadToGitHubParams {
  content: Buffer
  path: string
  message: string
}

export async function uploadToGitHub({ content, path, message }: UploadToGitHubParams) {
  try {
    const base64Content = content.toString('base64')
    
    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
      message,
      content: base64Content,
    })

    const downloadUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_OWNER}/${GITHUB_REPO}@main/${path}`
    const githubUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/blob/main/${path}`

    return {
      success: true,
      downloadUrl,
      githubUrl,
      sha: response.data.content?.sha,
    }
  } catch (error) {
    console.error('GitHub upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

export async function deleteFromGitHub(path: string) {
  try {
    // First get the file to get its SHA
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
    })

    if ('sha' in fileData) {
      await octokit.rest.repos.deleteFile({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path,
        message: `Delete ${path}`,
        sha: fileData.sha,
      })
      return { success: true }
    }
    
    return { success: false, error: 'File not found' }
  } catch (error) {
    console.error('GitHub delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    }
  }
}