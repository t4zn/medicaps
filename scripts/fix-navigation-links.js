const fs = require('fs')
const path = require('path')

// Branch mapping
const branchMap = {
  'CSE': 'computer-science-and-engineering',
  'CSE - AI': 'cse-artificial-intelligence', 
  'CSE - DS': 'cse-data-science',
  'CSE - Networks': 'cse-networks',
  'CSE - AI & ML': 'cse-artificial-intelligence-and-machine-learning',
  'Cyber Security': 'cse-cyber-security',
  'CSE - IoT': 'cse-internet-of-things',
  'CSBS': 'csbs-computer-science-and-business-systems',
  'ECE': 'ece-electronics-communication-engineering',
  'Civil': 'ce-civil-engineering',
  'Electrical': 'ee-electrical-engineering',
  'Automobile (EV)': 'au-ev-automobile-engineering-electric-vehicle',
  'IT': 'it-information-technology',
  'Mechanical': 'mechanical-engineering',
  'Robotics & Automation': 'ra-robotics-and-automation'
}

function fixNavigationLinks() {
  const documentsPath = path.join(__dirname, '..', 'settings', 'documents.ts')
  let content = fs.readFileSync(documentsPath, 'utf8')
  
  // For each branch, find its section and update all links
  Object.entries(branchMap).forEach(([branchTitle, branchSlug]) => {
    // Find the branch section
    const branchRegex = new RegExp(
      `(title: "${branchTitle}"[\\s\\S]*?items: \\[[\\s\\S]*?)href: "/notes/btech/([^"]+)"`,
      'g'
    )
    
    content = content.replace(branchRegex, (match, prefix, linkPart) => {
      return `${prefix}href: "/notes/btech/${branchSlug}/${linkPart}"`
    })
  })
  
  fs.writeFileSync(documentsPath, content, 'utf8')
  console.log('Navigation links updated successfully!')
}

fixNavigationLinks()