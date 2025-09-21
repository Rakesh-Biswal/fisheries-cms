import DashboardLayout from "@/components/PM_Component/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle, Phone, Mail, MessageCircle, Book } from "lucide-react"

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I add a new crop to my farm?",
      answer:
        "Go to Puspreterie section and click 'Add New Crop'. Fill in the crop details including variety, area, and planting date.",
    },
    {
      question: "How can I schedule equipment maintenance?",
      answer:
        "Navigate to the Maintenance section and click 'Schedule Maintenance'. Select the equipment and set the maintenance date.",
    },
    {
      question: "How do I track my field health?",
      answer:
        "The Field Health Index is automatically updated based on sensor data and manual inputs. Check the dashboard for real-time updates.",
    },
    {
      question: "Can I export my farm data?",
      answer:
        "Yes, you can export data from any section using the export button. Data is available in CSV and PDF formats.",
    },
  ]

  return (
    <DashboardLayout title="Help & Support">
      <div className="space-y-6">
        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-lg">
                <Phone className="w-8 h-8 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-sm text-gray-600 mb-4">Get immediate help from our support team</p>
                <p className="font-medium">+91 1800-123-4567</p>
                <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 6 PM</p>
              </div>

              <div className="text-center p-6 border rounded-lg">
                <Mail className="w-8 h-8 mx-auto mb-4 text-green-600" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-gray-600 mb-4">Send us your questions and we'll respond within 24 hours</p>
                <p className="font-medium">support@agroflow.com</p>
                <p className="text-sm text-gray-500">24/7 Response</p>
              </div>

              <div className="text-center p-6 border rounded-lg">
                <MessageCircle className="w-8 h-8 mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600 mb-4">Chat with our support agents in real-time</p>
                <Button className="w-full">Start Chat</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Ticket */}
        <Card>
          <CardHeader>
            <CardTitle>Submit Support Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input placeholder="Brief description of your issue" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Describe your issue in detail..." rows={4} />
            </div>
            <Button>Submit Ticket</Button>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-5 h-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b pb-4">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>Documentation & Guides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Getting Started Guide</h3>
                <p className="text-sm text-gray-600 mb-4">Learn the basics of using AgroFlow CRM</p>
                <Button variant="outline" size="sm">
                  View Guide
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Farm Management Best Practices</h3>
                <p className="text-sm text-gray-600 mb-4">Tips and tricks for effective farm management</p>
                <Button variant="outline" size="sm">
                  Read More
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Equipment Maintenance Guide</h3>
                <p className="text-sm text-gray-600 mb-4">How to maintain your farm equipment properly</p>
                <Button variant="outline" size="sm">
                  Download PDF
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Crop Planning Calendar</h3>
                <p className="text-sm text-gray-600 mb-4">Seasonal crop planning and scheduling</p>
                <Button variant="outline" size="sm">
                  View Calendar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
