
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRequestForm } from "@/hooks/useRequestForm";
import NewRequestForm from "@/components/request/NewRequestForm";
import { MessageCircle, HelpCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EnquiryPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, userProfile } = useAuth();
  const { isRegularUser } = useRoles(userProfile);
  const [messages, setMessages] = useState<any[]>([]);
  
  const requestFormProps = useRequestForm(setMessages);
  const { showNewRequest, setShowNewRequest } = requestFormProps;

  // Force isEnquiry to be true for this page
  useEffect(() => {
    requestFormProps.setIsEnquiry(true);
  }, []);

  // Redirect non-regular users to their appropriate dashboard
  useEffect(() => {
    if (userProfile && !isRegularUser()) {
      navigate('/dashboard');
    }
  }, [userProfile, navigate, isRegularUser]);

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

  // If it's not a regular user, return nothing since they'll be redirected
  if (userProfile && !isRegularUser()) {
    return null;
  }

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

        {!showNewRequest ? (
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
        ) : (
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
