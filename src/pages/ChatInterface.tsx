
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRequestForm } from "@/hooks/useRequestForm";
import NewRequestForm from "@/components/request/NewRequestForm";
import { FileText, Send } from "lucide-react";

const RequestSubmissionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [showNewRequest, setShowNewRequest] = useState(false);
  
  // Use the request form hook
  const requestFormProps = useRequestForm(setMessages);

  // Show the request form if 'action=new' is in the URL or if type is specified
  useEffect(() => {
    const action = searchParams.get("action");
    const type = searchParams.get("type");
    
    if (action === "new" || type) {
      setShowNewRequest(true);
      
      // If type is specified, set it in the form
      if (type) {
        requestFormProps.setRequestForm(prev => ({
          ...prev,
          type
        }));
      }
    }
  }, [searchParams, requestFormProps.setRequestForm]);

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Submit Support Request</h1>
          <p className="text-muted-foreground">
            Bridging Gaps Foundation (BGF) empowers vulnerable individuals and communities across Zimbabwe through sustainable development initiatives
          </p>
        </div>

        {!showNewRequest ? (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg space-y-4">
            <FileText size={48} className="text-muted-foreground" />
            <h2 className="text-xl font-semibold text-center">Create a Support Request</h2>
            <p className="text-center text-muted-foreground max-w-md">
              We focus on addressing critical needs in education, healthcare, livelihood, water & sanitation, and emergency relief. 
              Submit your request with detailed information to help us assist you effectively.
            </p>
            <Button 
              size="lg" 
              className="mt-4"
              onClick={() => setShowNewRequest(true)}
            >
              <Send className="mr-2 h-4 w-4" /> Start Request
            </Button>
          </div>
        ) : (
          <div className="border border-border p-6 rounded-lg">
            <NewRequestForm
              requestForm={requestFormProps.requestForm}
              setRequestForm={requestFormProps.setRequestForm}
              selectedFiles={requestFormProps.selectedFiles}
              setSelectedFiles={requestFormProps.setSelectedFiles}
              submitting={requestFormProps.submitting}
              setShowNewRequest={requestFormProps.setShowNewRequest}
              handleRequestSubmit={requestFormProps.handleRequestSubmit}
              requestTypeInfo={requestFormProps.requestTypeInfo}
            />
          </div>
        )}
        
        {/* Information about the request process */}
        <div className="mt-8 bg-secondary/30 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Our Support Process</h3>
          <ol className="list-decimal ml-5 space-y-2">
            <li>Complete the support request form with accurate and detailed information</li>
            <li>Upload any relevant supporting documents to strengthen your case</li>
            <li>Submit your request for assessment by our dedicated team</li>
            <li>Our field officers may contact you for verification and further information</li>
            <li>Based on the assessment, appropriate support will be provided according to our available resources</li>
          </ol>
        </div>

        {/* Additional information about BGF's focus areas */}
        <div className="mt-4 bg-primary/5 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Our Focus Areas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <h4 className="font-medium">Education Support</h4>
              <p className="text-sm text-muted-foreground">School fees, learning materials, and educational programs</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium">Healthcare Assistance</h4>
              <p className="text-sm text-muted-foreground">Medical treatments, medications, and health services</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium">Livelihood Development</h4>
              <p className="text-sm text-muted-foreground">Skills training, income generation, and financial literacy</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium">Water & Sanitation</h4>
              <p className="text-sm text-muted-foreground">Clean water access, sanitation facilities, and hygiene education</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium">Emergency Relief</h4>
              <p className="text-sm text-muted-foreground">Disaster response, food security, and shelter assistance</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium">Community Development</h4>
              <p className="text-sm text-muted-foreground">Infrastructure projects and community-based initiatives</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestSubmissionPage;
