import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SimpleBreadcrumb } from "@/components/ui/breadcrumb"
import { BookOpen, Bot, Upload, User, HelpCircle } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SimpleBreadcrumb items={[{ label: "Documentation" }]} homeHref="/welcome" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Documentation</h1>
        <p className="text-muted-foreground">Learn how to use our platform effectively</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Quick start guide for new users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Create an Account</h3>
              <p className="text-sm text-muted-foreground">Sign up with your email to access all features</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Browse Content</h3>
              <p className="text-sm text-muted-foreground">Explore notes, formula sheets, and previous year questions by program and subject</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Share Google Drive Links</h3>
              <p className="text-sm text-muted-foreground">Share Google Drive links to your study materials to help the community</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>What you can do on our platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">Study Materials</h3>
                <p className="text-sm text-muted-foreground">Access notes, formula sheets, and previous year questions organized by program and subject</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Bot className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">AI Chat</h3>
                <p className="text-sm text-muted-foreground">Get instant help with subject-specific questions using our AI assistant</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Upload className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">Google Drive Integration</h3>
                <p className="text-sm text-muted-foreground">Share Google Drive links to your study materials with the community</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">Profile Management</h3>
                <p className="text-sm text-muted-foreground">Track your shared Google Drive links and manage your account settings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>Find answers to common questions about our platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger variant="plus">How do I share study materials?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    To share study materials, first upload your files to Google Drive and set sharing permissions to 
                    &ldquo;Anyone with the link can view&rdquo;. Then navigate to the upload page, paste the Google Drive link, 
                    add file details, choose the appropriate program, year, and subject, then submit. 
                    Your shared links will be reviewed and made available to the community.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger variant="plus">What file formats are supported?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    We support Google Drive links to PDF files. Your files should be uploaded to Google Drive 
                    with proper sharing permissions set to &ldquo;Anyone with the link can view&rdquo;. 
                    For best results, use PDF format for documents and ensure files are properly named.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger variant="plus">How does the AI chat feature work?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Our AI chat is available on subject pages and can help answer questions related to that specific subject. 
                    Simply type your question and get instant, contextual responses based on educational content.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger variant="plus">Can I download materials for offline use?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Yes, you can download any study material by clicking the Google Drive link which will take you 
                    directly to the file. From there, you can download the file using Google Drive&rsquo;s download feature. 
                    Downloaded files can be used offline for your studies.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger variant="plus">How do I report inappropriate content?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    If you find content that violates our guidelines, click the report button next to the file. 
                    Our moderation team will review the report and take appropriate action.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger variant="plus">Is my personal information secure?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Yes, we take data security seriously. All personal information is encrypted and stored securely. 
                    We never share your personal data with third parties. See our Privacy Policy for more details.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
            <CardDescription>Need help? We&rsquo;re here for you</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If you encounter any issues or have questions not covered in our FAQ, please reach out to our support team. 
              We&rsquo;re committed to providing the best experience for all users.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}