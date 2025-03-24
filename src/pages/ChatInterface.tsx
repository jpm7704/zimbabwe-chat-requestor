
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
          <h1 className="text-3xl font-bold mb-2">Submit Request</h1>
          <p className="text-muted-foreground">
            Create a new support request for BGF Zimbabwe assistance
          </p>
        </div>

        {!showNewRequest ? (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg space-y-4">
            <FileText size={48} className="text-muted-foreground" />
            <h2 className="text-xl font-semibold text-center">Create a New Request</h2>
            <p className="text-center text-muted-foreground max-w-md">
              Submit a request for assistance from BGF Zimbabwe. Please provide as much detail as possible to help us process your request effectively.
            </p>
            <Button 
              size="lg" 
              className="mt-4"
              onClick={() => setShowNewRequest(true)}
            >
              <Send className="mr-2 h-4 w-4" /> Create Request
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
          <h3 className="text-lg font-medium mb-3">Request Submission Process</h3>
          <ol className="list-decimal ml-5 space-y-2">
            <li>Complete the request form with accurate information</li>
            <li>Upload all required documents based on request type</li>
            <li>Submit your request for review</li>
            <li>Track your request status from the Requests page</li>
            <li>You'll be notified when there are updates to your request</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RequestSubmissionPage;
