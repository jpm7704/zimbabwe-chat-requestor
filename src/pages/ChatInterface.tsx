
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

  // Show the request form if 'action=new' is in the URL
  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setShowNewRequest(true);
    }
  }, [searchParams]);

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Submit Support Request</h1>
          <p className="text-muted-foreground">
            Bridging Gaps Foundation (BGF) supports individuals and communities in need across Zimbabwe
          </p>
        </div>

        {!showNewRequest ? (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg space-y-4">
            <FileText size={48} className="text-muted-foreground" />
            <h2 className="text-xl font-semibold text-center">Create a Support Request</h2>
            <p className="text-center text-muted-foreground max-w-md">
              Our mission is to support vulnerable individuals and communities. 
              Please provide detailed information about your needs to help us assist you effectively.
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
              setShowNewRequest={setShowNewRequest}
              handleRequestSubmit={requestFormProps.handleRequestSubmit}
              requestTypeInfo={requestFormProps.requestTypeInfo}
            />
          </div>
        )}
        
        {/* Information about the request process */}
        <div className="mt-8 bg-secondary/30 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Our Support Process</h3>
          <ol className="list-decimal ml-5 space-y-2">
            <li>Complete the support request form with accurate and compassionate details</li>
            <li>Upload any relevant supporting documents</li>
            <li>Submit your request for careful review</li>
            <li>Our team will assess and respond to your request</li>
            <li>We will contact you with next steps or additional support options</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RequestSubmissionPage;
