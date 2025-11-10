import { Documents } from '@/settings/documents'

export function validateSubjectExists(program: string, branch: string | null, year: string, subject: string): boolean {
  try {
    // Convert documents to string and search for the exact href pattern
    const documentsString = JSON.stringify(Documents)
    
    // Build the expected href pattern
    let expectedHref: string
    
    if (program === 'btech' && branch) {
      expectedHref = `/notes/btech/${branch}/${year}/${subject}`
    } else {
      expectedHref = `/notes/${program}/${year}/${subject}`
    }
    
    // Check if this exact href exists in documents.ts
    return documentsString.includes(`"href":"${expectedHref}"`)
  } catch (error) {
    console.error('Error validating subject:', error)
    return false
  }
}

export function getSubjectRequestUrl(program: string, branch: string | null, year: string, subject: string): string {
  const params = new URLSearchParams({
    program,
    year,
    subject_name: subject.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  })
  
  if (branch) {
    // Map branch slug back to full name
    const branchMap: { [key: string]: string } = {
      'cse': 'Computer Science and Engineering',
      'cse-ai': 'CSE - Artificial Intelligence',
      'cse-ds': 'CSE - Data Science',
      'cse-networks': 'CSE - Networks',
      'cse-aiml': 'CSE - AI & ML',
      'cyber-security': 'Cyber Security',
      'cse-iot': 'CSE - IoT',
      'csbs': 'Computer Science and Business Systems',
      'ece': 'Electronics and Communication Engineering',
      'civil': 'Civil Engineering',
      'electrical': 'Electrical Engineering',
      'automobile-ev': 'Automobile Engineering (EV)',
      'it': 'Information Technology',
      'mechanical': 'Mechanical Engineering',
      'robotics-automation': 'Robotics & Automation'
    }
    params.set('branch', branchMap[branch] || branch)
  }
  
  return `/settings/subject-requests?${params.toString()}`
}