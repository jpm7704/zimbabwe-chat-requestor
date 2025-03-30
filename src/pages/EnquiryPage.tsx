
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRequestForm } from "@/hooks/useRequestForm";
import NewRequestForm from "@/components/request/NewRequestForm";
import { MessageCircle, HelpCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EnquiryPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, userProfile } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  
  const requestFormProps = useRequestForm(setMessages);
  const { showNewRequest, setShowNewRequest } = requestFormProps;

  // Force isEnquiry to be true for this page
  useEffect(() => {
    requestFormProps.setIsEnquiry(true);
  }, []);

  useEffect(() => {
    const type = searchParams.get("type");
    
    if (isAuthenticated) {
      setShowNewRequest(true);
      
      if (type) {
        requestFormProps.setRequestForm(prev => ({
          ...prev,
          type
        }));
      }
    } else if (type) {
      navigate('/login');
    }
  }, [searchParams, requestFormProps.setRequestForm, isAuthenticated, navigate, setShowNewRequest]);

  const isStaffUser = userProfile && userProfile.role !== 'user';

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-3 text-elegant">
            <span className="flex items-center gap-2">
              <HelpCircle className="text-primary" />
              Submit an Enquiry
            </span>
          </h1>
          <p className="text-muted-foreground font-serif text-lg">
            Request information or guidance about our support programs without a formal application
          </p>
        </div>

        {isStaffUser && (
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800">Staff Account</AlertTitle>
            <AlertDescription className="text-blue-700">
              You are logged in with a staff account. You can view and manage enquiries in the dashboard.
            </AlertDescription>
            <Button variant="outline" className="mt-2" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </Alert>
        )}

        {!showNewRequest && !isStaffUser ? (
          <Alert variant="default" className="bg-primary/5 border-primary/20">
            <MessageCircle className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary-foreground">Select an enquiry type</AlertTitle>
            <AlertDescription>
              Please select an enquiry type from the home page or use the form below to submit a general enquiry.
            </AlertDescription>
            <Button className="mt-2" onClick={() => setShowNewRequest(true)}>
              Start General Enquiry
            </Button>
          </Alert>
        ) : !isStaffUser && (
          <div className="border border-primary/20 p-8 rounded-lg bg-card/40 shadow-sm">
            <div className="mb-6 flex items-center gap-2 pb-3 border-b border-primary/10">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span className="font-serif text-lg font-medium">Enquiry Form</span>
            </div>
            
            <NewRequestForm
              requestForm={requestFormProps.requestForm}
              setRequestForm={requestFormProps.setRequestForm}
              selectedFiles={requestFormProps.selectedFiles}
              setSelectedFiles={requestFormProps.setSelectedFiles}
              submitting={requestFormProps.submitting}
              setShowNewRequest={requestFormProps.setShowNewRequest}
              handleRequestSubmit={requestFormProps.handleRequestSubmit}
              requestTypeInfo={requestFormProps.requestTypeInfo}
              isEnquiry={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryPage;
