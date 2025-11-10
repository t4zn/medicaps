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

async function createSubjectPage(subject_name: string, subject_code: string, branch: string, year: string) {
  try {
    const subjectSlug = createSubjectSlug(subject_name)
    const branchSlug = getBranchSlug(branch)
    const subjectPagePath = path.join(process.cwd(), 'app', 'notes', 'btech', branchSlug, year, subjectSlug)
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(subjectPagePath)) {
      fs.mkdirSync(subjectPagePath, { recursive: true })
    }
    
    // Create page.tsx file
    const pageContent = `import { SubjectPage } from '@/components/SubjectPage'

export default function ${subject_name.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return (
    <SubjectPage
      program="btech"
      branch="${branchSlug}"
      year="${year}"
      subject="${subjectSlug}"
      subjectName="${subject_name}"
      subjectCode="${subject_code}"
    />
  )
}

export async function generateMetadata() {
  return {
    title: '${subject_name} (${subject_code}) - B.Tech ${branch.toUpperCase()} ${year.replace('-', ' ')} - Medicaps Resources',
    description: 'Access comprehensive study materials, notes, PYQs, and formula sheets for ${subject_name} (${subject_code}) - B.Tech ${branch.toUpperCase()} ${year.replace('-', ' ')} at Medicaps University.',
  }
}`
    
    const pageFilePath = path.join(subjectPagePath, 'page.tsx')
    fs.writeFileSync(pageFilePath, pageContent, 'utf8')
    
    return true
  } catch (error) {
    console.error('Error creating subject page:', error)
    return false
  }
}

async function updateNavigation(subject_name: string, subject_code: string, branch: string, year: string) {
  try {
    // Read current documents.ts file
    const documentsPath = path.join(process.cwd(), 'settings', 'documents.ts')
    const documentsContent = fs.readFileSync(documentsPath, 'utf8')

    // Create subject entry
    const subjectSlug = createSubjectSlug(subject_name)
    const branchSlug = getBranchSlug(branch)
    const subjectEntry = `                  {
                    title: "${subject_name}",
                    href: "/notes/btech/${branchSlug}/${year}/${subjectSlug}",
                  },`

    // Find the correct branch and year section to add the subject
    // Map branch name to the title used in documents.ts
    const branchTitleMap: { [key: string]: string } = {
      'Computer Science and Engineering': 'CSE',
      'CSE - Artificial Intelligence': 'CSE - AI',
      'CSE - Data Science': 'CSE - DS',
      'CSE - Networks': 'CSE - Networks',
      'CSE - AI & ML': 'CSE - AI & ML',
      'Cyber Security': 'Cyber Security',
      'CSE - IoT': 'CSE - IoT',
      'Computer Science and Business Systems': 'CSBS',
      'Electronics and Communication Engineering': 'ECE',
      'Civil Engineering': 'Civil',
      'Electrical Engineering': 'Electrical',
      'Automobile Engineering (EV)': 'Automobile (EV)',
      'Information Technology': 'IT',
      'Mechanical Engineering': 'Mechanical',
      'Robotics & Automation': 'Robotics & Automation'
    }
    
    const branchTitle = branchTitleMap[branch] || branch
    
    const branchSectionRegex = new RegExp(
      `(title: "${branchTitle}"[\\s\\S]*?title: "${year.replace('-', ' ')}"[\\s\\S]*?items: \\[[\\s\\S]*?)(\\s*\\{[\\s\\S]*?title: "Mix"[\\s\\S]*?\\})`,
      'i'
    )

    const match = documentsContent.match(branchSectionRegex)
    if (match) {
      // Check if subject already exists
      if (!documentsContent.includes(`title: "${subject_name}"`)) {
        // Add the new subject before the "Mix" entry
        const updatedContent = documentsContent.replace(
          branchSectionRegex,
          `$1${subjectEntry}
$2`
        )
        
        // Write the updated content back to the file
        fs.writeFileSync(documentsPath, updatedContent, 'utf8')
        
        // Also create the subject page
        await createSubjectPage(subject_name, subject_code, branch, year)
        
        return true
      }
    } else {
      console.error('Could not find branch section for:', branch, year)
      console.log('Available content preview:', documentsContent.substring(0, 500))
    }
    return false
  } catch (error) {
    console.error('Error updating navigation:', error)
    return false
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, rejection_reason, userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user is admin
    const isAdmin = await checkAdminAccess(userId)

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    if (status === 'rejected' && !rejection_reason) {
      return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 })
    }

    const { data: updatedRequest, error } = await supabaseAdmin
      .from('subject_requests')
      .update({
        status,
        rejection_reason: status === 'rejected' ? rejection_reason : null,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        requested_by_profile:profiles!requested_by(full_name, email),
        reviewed_by_profile:profiles!reviewed_by(full_name)
      `)
      .single()

    if (error) {
      console.error('Error updating subject request:', error)
      return NextResponse.json({ error: 'Failed to update request' }, { status: 500 })
    }

    // If approved, automatically add to navigation
    if (status === 'approved' && updatedRequest) {
      const navigationUpdated = await updateNavigation(
        updatedRequest.subject_name,
        updatedRequest.subject_code,
        updatedRequest.branch,
        updatedRequest.year
      )
      
      if (!navigationUpdated) {
        console.warn('Failed to update navigation, but request was approved')
      }
    }

    return NextResponse.json({ request: updatedRequest })
  } catch (error) {
    console.error('Error in subject request PATCH:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { subject_name, subject_code, description, program, branch, year, userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user is admin
    const isAdmin = await checkAdminAccess(userId)

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Validation
    if (!subject_name || !subject_code || !description || !program || !branch || !year) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (description.length > 150) {
      return NextResponse.json({ error: 'Description must be 150 characters or less' }, { status: 400 })
    }

    const { data: updatedRequest, error } = await supabaseAdmin
      .from('subject_requests')
      .update({
        subject_name,
        subject_code,
        description,
        program,
        branch,
        year,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        requested_by_profile:profiles!requested_by(full_name, email),
        reviewed_by_profile:profiles!reviewed_by(full_name)
      `)
      .single()

    if (error) {
      console.error('Error updating subject request:', error)
      return NextResponse.json({ error: 'Failed to update request' }, { status: 500 })
    }

    return NextResponse.json({ request: updatedRequest })
  } catch (error) {
    console.error('Error in subject request PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user is admin
    const isAdmin = await checkAdminAccess(userId)

    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { error } = await supabaseAdmin
      .from('subject_requests')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting subject request:', error)
      return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Subject request deleted successfully' })
  } catch (error) {
    console.error('Error in subject request DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}