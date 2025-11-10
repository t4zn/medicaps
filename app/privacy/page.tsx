import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleBreadcrumb } from "@/components/ui/breadcrumb"
import { Shield, Database, Users, Lock, Eye, FileText, Mail, AlertTriangle } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SimpleBreadcrumb items={[{ label: "Privacy Policy" }]} homeHref="/welcome" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="text-sm text-muted-foreground mt-2">
          This Privacy Policy describes how we collect, use, and protect your information when you use our educational platform.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Personal Information
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                <li>• Email address (required for account creation and communication)</li>
                <li>• Display name and profile information (optional)</li>
                <li>• Educational institution and program details (optional)</li>
                <li>• Profile picture (optional)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Usage and Analytics Data
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                <li>• Pages visited and time spent on platform</li>
                <li>• Files accessed via Google Drive links and links shared</li>
                <li>• Search queries and interaction patterns</li>
                <li>• Device information (browser type, operating system)</li>
                <li>• IP address and general location (country/region level)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content and Files
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                <li>• Google Drive links to study materials you share</li>
                <li>• File metadata (name, description, category, share date)</li>
                <li>• Comments and ratings on shared content</li>
                <li>• Chat messages with AI assistant</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Educational Services</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Provide access to study materials via Google Drive integration</li>
                <li>• Enable resource sharing through secure Google Drive links</li>
                <li>• Facilitate AI-powered educational assistance</li>
                <li>• Organize content by academic programs and subjects</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Platform Improvement</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Analyze usage patterns to enhance user experience</li>
                <li>• Improve search and recommendation algorithms</li>
                <li>• Develop new features based on user needs</li>
                <li>• Ensure platform performance and reliability</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Communication and Support</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Send important updates about service changes</li>
                <li>• Provide technical support and assistance</li>
                <li>• Notify about new features or educational content</li>
                <li>• Respond to inquiries and feedback</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Security and Compliance</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Prevent fraud, abuse, and unauthorized access</li>
                <li>• Comply with legal obligations and university policies</li>
                <li>• Maintain academic integrity standards</li>
                <li>• Protect intellectual property rights</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Data Protection and Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Technical Safeguards</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• End-to-end encryption for data transmission</li>
                <li>• Secure cloud storage with regular backups</li>
                <li>• Multi-factor authentication options</li>
                <li>• Regular security audits and vulnerability assessments</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Access Controls</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Role-based access to administrative functions</li>
                <li>• Limited employee access on need-to-know basis</li>
                <li>• Comprehensive audit logs of data access</li>
                <li>• Regular access reviews and permission updates</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Compliance Standards</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• FERPA compliance for educational records</li>
                <li>• GDPR compliance for EU users</li>
                <li>• SOC 2 Type II security standards</li>
                <li>• Regular compliance assessments</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Information Sharing and Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">We DO NOT sell or rent your personal information</h3>
              <p className="text-sm text-muted-foreground">
                Your personal data is never sold to third parties for marketing or commercial purposes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Limited Sharing Scenarios</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Service providers (hosting, analytics) under strict data processing agreements</li>
                <li>• Legal compliance when required by law or court order</li>
                <li>• Academic institutions for educational research (anonymized data only)</li>
                <li>• Emergency situations to protect user safety</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Public Content</h3>
              <p className="text-sm text-muted-foreground ml-4">
                Google Drive links you share are made available to the academic community. 
                Your name may be associated with shared content unless you choose to remain anonymous.
                Note: Files remain stored in your personal Google Drive account.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Your Privacy Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Access and Portability</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Request a copy of all personal data we hold</li>
                <li>• Export your shared Google Drive links and account data</li>
                <li>• Receive data in a machine-readable format</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Correction and Updates</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Update your profile information at any time</li>
                <li>• Correct inaccurate personal data</li>
                <li>• Modify privacy preferences and settings</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Deletion and Restriction</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Delete your account and associated personal data</li>
                <li>• Request removal of specific shared Google Drive links</li>
                <li>• Restrict processing of your personal information</li>
                <li>• Opt-out of non-essential communications</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Data Retention and Deletion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Retention Periods</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Account data: Retained while account is active + 2 years after deletion</li>
                <li>• Shared Google Drive links: Retained indefinitely for educational purposes (unless removed)</li>
                <li>• Usage analytics: Aggregated data retained for 5 years</li>
                <li>• Support communications: Retained for 3 years</li>
                <li>• Note: Actual files remain in your Google Drive and are controlled by your Google account settings</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Automatic Deletion</h3>
              <p className="text-sm text-muted-foreground ml-4">
                Inactive accounts (no login for 3+ years) are automatically scheduled for deletion 
                with 90 days advance notice via email.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact and Complaints
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Privacy Officer Contact</h3>
              <p className="text-sm text-muted-foreground">
                For privacy-related questions, data requests, or complaints, contact our Privacy Officer 
                through our support system or designated privacy contact channels.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Response Timeline</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Privacy inquiries: Response within 5 business days</li>
                <li>• Data access requests: Fulfilled within 30 days</li>
                <li>• Deletion requests: Processed within 30 days</li>
                <li>• Urgent security matters: Immediate response</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Regulatory Complaints</h3>
              <p className="text-sm text-muted-foreground">
                You have the right to file complaints with relevant data protection authorities 
                if you believe your privacy rights have been violated.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Policy Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We may update this Privacy Policy to reflect changes in our practices or legal requirements. 
              Significant changes will be communicated via email and platform notifications at least 30 days 
              before taking effect. Continued use of the platform after changes constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}