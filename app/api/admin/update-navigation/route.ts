import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const OWNER_EMAIL = 'pathforge2025@gmail.com'

async function checkAdminAccess(userId: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: userProfile } = await supabaseAdmin
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single()

  return userProfile?.email === OWNER_EMAIL
}

function createSubjectSlug(subjectName: string): string {
  return subjectName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

function getBranchSlug(branch: string): string {
  // Map full branch names to short slugs
  const branchMap: { [key: string]: string } = {
    'Computer Science and Engineering': 'cse',
    'CSE - Artificial Intelligence': 'cse-ai',
    'CSE - Data Science': 'cse-ds',
    'CSE - Networks': 'cse-networks',
    'CSE - AI & ML': 'cse-aiml',
    'Cyber Security': 'cyber-security',
    'CSE - IoT': 'cse-iot',
    'Computer Science and Business Systems': 'csbs',
    'Electronics and Communication Engineering': 'ece',
    'Civil Engineering': 'civil',
    'Electrical Engineering': 'electrical',
    'Automobile Engineering (EV)': 'automobile-ev',
    'Information Technology': 'it',
    'Mechanical Engineering': 'mechanical',
    'Robotics & Automation': 'robotics-automation'
  }
  return branchMap[branch] || branch.toLowerCase().replace(/\s+/g, '-')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject_name, branch, year, userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Check if user is admin
    const isAdmin = await checkAdminAccess(userId)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Read current documents.ts file
    const documentsPath = path.join(process.cwd(), 'settings', 'documents.ts')
    const documentsContent = fs.readFileSync(documentsPath, 'utf8')

    // Create subject entry
    const subjectSlug = createSubjectSlug(subject_name)
    const branchSlug = getBranchSlug(branch)
    const subjectEntry = `              {
                title: "${subject_name}",
                href: "/notes/btech/${branchSlug}/${year}/${subjectSlug}",
              },`

    // Find the correct branch and year section to add the subject
    // First try to match by branch name, then by slug
    let branchSectionRegex = new RegExp(
      `(title: "${branch}"[\\s\\S]*?title: "${year.replace('-', ' ')}"[\\s\\S]*?items: \\[[\\s\\S]*?)(\\s*\\{[\\s\\S]*?title: "Mix"[\\s\\S]*?\\})`,
      'i'
    )
    
    // If not found, try with branch slug in href
    if (!documentsContent.match(branchSectionRegex)) {
      branchSectionRegex = new RegExp(
        `(href: "/${branchSlug}"[\\s\\S]*?title: "${year.replace('-', ' ')}"[\\s\\S]*?items: \\[[\\s\\S]*?)(\\s*\\{[\\s\\S]*?title: "Mix"[\\s\\S]*?\\})`,
        'i'
      )
    }

    const match = documentsContent.match(branchSectionRegex)
    if (match) {
      // Add the new subject before the "Mix" entry
      const updatedContent = documentsContent.replace(
        branchSectionRegex,
        `$1${subjectEntry}
$2`
      )
      
      // Write the updated content back to the file
      fs.writeFileSync(documentsPath, updatedContent, 'utf8')
      
      return NextResponse.json({ 
        message: 'Navigation updated successfully',
        subjectPath: `/notes/btech/${branchSlug}/${year}/${subjectSlug}`
      })
    } else {
      return NextResponse.json({ 
        error: 'Could not find the appropriate section to add the subject' 
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Error updating navigation:', error)
    return NextResponse.json({ error: 'Failed to update navigation' }, { status: 500 })
  }
}