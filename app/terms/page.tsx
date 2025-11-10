import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleBreadcrumb } from "@/components/ui/breadcrumb"
import { FileText, Shield, Users, AlertTriangle, Scale, BookOpen, Gavel, Clock } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SimpleBreadcrumb items={[{ label: "Terms of Service" }]} homeHref="/welcome" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="text-sm text-muted-foreground mt-2">
          These Terms of Service govern your use of our educational platform and services.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Acceptance and Agreement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              By creating an account, accessing, or using this educational platform, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree 
              to these terms, you must not use our services.
            </p>
            <div>
              <h3 className="font-semibold mb-2">Eligibility Requirements</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Must be at least 13 years old (or age of digital consent in your jurisdiction)</li>
                <li>• Must be affiliated with an educational institution or engaged in academic pursuits</li>
                <li>• Must provide accurate and complete registration information</li>
                <li>• Must comply with all applicable local, state, and federal laws</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Educational Use and Academic Integrity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Permitted Educational Uses</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Sharing Google Drive links to study materials, notes, and educational resources</li>
                <li>• Collaborative learning and academic discussion</li>
                <li>• Research and reference for academic purposes</li>
                <li>• Personal study and skill development</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Academic Integrity Standards</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Do not share Google Drive links to current exam questions or answers</li>
                <li>• Respect your institution&rsquo;s honor code and academic policies</li>
                <li>• Properly attribute sources and give credit to original authors</li>
                <li>• Do not facilitate academic dishonesty or plagiarism</li>
                <li>• Report suspected violations of academic integrity</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Responsibilities and Conduct
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Account Management</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Maintain the confidentiality of your login credentials</li>
                <li>• Use a strong, unique password and enable two-factor authentication</li>
                <li>• Do not share your account or allow others to access it</li>
                <li>• Immediately report any unauthorized access or security breaches</li>
                <li>• Keep your profile information accurate and up-to-date</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Content Standards</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Share only Google Drive links to educational content relevant to academic subjects</li>
                <li>• Ensure all shared content is appropriate for an academic environment</li>
                <li>• Verify you have the right to share any materials via Google Drive links</li>
                <li>• Provide accurate descriptions and categorization of shared content</li>
                <li>• Respect copyright, trademark, and intellectual property rights</li>
                <li>• Maintain proper Google Drive sharing permissions (view-only access)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Community Guidelines</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Treat all users with respect and professionalism</li>
                <li>• Engage in constructive and educational discussions</li>
                <li>• Report inappropriate content or behavior</li>
                <li>• Respect diverse perspectives and academic viewpoints</li>
                <li>• Maintain a supportive learning environment</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Prohibited Activities and Violations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Strictly Prohibited Content</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Links to files containing malware, viruses, or other harmful software</li>
                <li>• Copyrighted material without proper authorization</li>
                <li>• Current exam questions, answer keys, or graded assignments</li>
                <li>• Inappropriate, offensive, or discriminatory content</li>
                <li>• Personal information of others without consent</li>
                <li>• Commercial advertisements or promotional materials</li>
                <li>• Invalid or broken Google Drive links</li>
                <li>• Links to files with restricted access permissions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Prohibited Behaviors</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Attempting to hack, breach, or compromise platform security</li>
                <li>• Creating multiple accounts or impersonating others</li>
                <li>• Harassment, bullying, or threatening other users</li>
                <li>• Spamming or sending unsolicited communications</li>
                <li>• Circumventing access controls or usage limitations</li>
                <li>• Using automated tools to scrape or download content</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Enforcement Actions</h3>
              <p className="text-sm text-muted-foreground ml-4">
                Violations may result in content removal, account suspension, permanent ban, 
                or reporting to educational institutions or law enforcement as appropriate.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Intellectual Property and Content Ownership
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Your Content Rights</h3>
              <p className="text-sm text-muted-foreground ml-4">
                You retain full ownership of all files stored in your Google Drive. By sharing Google Drive links 
                on our platform, you grant us a non-exclusive, worldwide, royalty-free license to display 
                the link information and metadata for educational purposes. The actual files remain under 
                your control in your Google Drive account.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Platform Rights</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• We own all rights to the platform software, design, and functionality</li>
                <li>• Our trademarks, logos, and branding are protected intellectual property</li>
                <li>• We may use aggregated, anonymized data for research and improvement</li>
                <li>• We reserve the right to remove content that violates these terms</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Copyright Compliance</h3>
              <p className="text-sm text-muted-foreground ml-4">
                We comply with the Digital Millennium Copyright Act (DMCA). If you believe your 
                copyrighted work has been infringed, please contact us with a detailed notice 
                including proof of ownership and location of the infringing content.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Service Availability and Modifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Service Level</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
                <li>• Scheduled maintenance will be announced in advance when possible</li>
                <li>• Emergency maintenance may occur without prior notice</li>
                <li>• We are not liable for service interruptions beyond our control</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Platform Changes</h3>
              <p className="text-sm text-muted-foreground ml-4">
                We reserve the right to modify, update, or discontinue features with reasonable notice. 
                Major changes affecting core functionality will be communicated at least 30 days in advance.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Disclaimers and Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Service Disclaimers</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Platform is provided &ldquo;as is&rdquo; without warranties of any kind</li>
                <li>• We do not guarantee accuracy of user-generated content</li>
                <li>• Educational content is for reference only, not professional advice</li>
                <li>• Users are responsible for verifying information accuracy</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Liability Limitations</h3>
              <p className="text-sm text-muted-foreground ml-4">
                To the maximum extent permitted by law, we shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including but not limited to 
                loss of profits, data, or academic standing, arising from your use of the platform.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Indemnification</h3>
              <p className="text-sm text-muted-foreground ml-4">
                You agree to indemnify and hold us harmless from any claims, damages, or expenses 
                arising from your violation of these terms or misuse of the platform.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Termination and Account Closure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Voluntary Termination</h3>
              <p className="text-sm text-muted-foreground ml-4">
                You may close your account at any time through your profile settings. 
                Upon closure, your personal data will be deleted according to our Privacy Policy, 
                but shared Google Drive links may remain available to the community. 
                You can revoke access to your files by changing Google Drive sharing permissions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Involuntary Termination</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• We may suspend or terminate accounts for terms violations</li>
                <li>• Serious violations may result in immediate termination</li>
                <li>• You will be notified of termination reasons when possible</li>
                <li>• Appeals process available for disputed terminations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Governing Law and Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Applicable Law</h3>
              <p className="text-sm text-muted-foreground ml-4">
                These terms are governed by the laws of the jurisdiction where our company is incorporated, 
                without regard to conflict of law principles.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Dispute Resolution</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• First attempt resolution through direct communication</li>
                <li>• Mediation through agreed-upon neutral third party</li>
                <li>• Binding arbitration for unresolved disputes</li>
                <li>• Class action waiver (individual claims only)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changes to Terms and Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Terms Updates</h3>
              <p className="text-sm text-muted-foreground ml-4">
                We may update these Terms of Service to reflect changes in our services, legal requirements, 
                or business practices. Material changes will be communicated via email and platform notifications 
                at least 30 days before taking effect. Continued use constitutes acceptance of updated terms.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contact for Legal Matters</h3>
              <p className="text-sm text-muted-foreground ml-4">
                For questions about these terms, legal notices, or compliance matters, 
                contact our legal team through the designated channels in our support system.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}