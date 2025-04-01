
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRequestForm } from "@/hooks/useRequestForm";
import NewRequestForm from "@/components/request/NewRequestForm";
import { FileText, Send, Stethoscope, GraduationCap, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const RequestSubmissionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, userProfile } = useAuth();
  const { isPatron } = useRoles(userProfile);
  const [messages, setMessages] = useState<any[]>([]);
  
  const requestFormProps = useRequestForm(setMessages);
  const { showNewRequest, setShowNewRequest } = requestFormProps;

  // Redirect Patrons to the dashboard since they don't need to submit requests
  useEffect(() => {
    if (userProfile && isPatron()) {
      navigate('/dashboard');
    }
  }, [userProfile, navigate, isPatron]);

  useEffect(() => {
    const action = searchParams.get("action");
    const type = searchParams.get("type");
    
    if (action === "new" || type) {
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
    }
  }, [searchParams, requestFormProps.setRequestForm, isAuthenticated, navigate, setShowNewRequest]);

  const isStaffUser = userProfile && userProfile.role !== 'user';

  // If it's a Patron, return nothing since they'll be redirected
  if (userProfile && isPatron()) {
    return null;
  }

  return (
    <div className="container px-4 mx-auto max-w-5xl py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-3 text-elegant">Support Request</h1>
          <p className="text-muted-foreground font-serif text-lg">
            Empowering the vulnerable through sustainable development initiatives
          </p>
        </div>

        {isStaffUser && (
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800">Staff Account</AlertTitle>
            <AlertDescription className="text-blue-700">
              You are logged in with a staff account. You can view and manage requests in the dashboard instead of submitting new ones.
            </AlertDescription>
            <Button variant="outline" className="mt-2" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </Alert>
        )}

        {!showNewRequest && !isStaffUser ? (
          <div className="flex flex-col md:flex-row gap-6 mt-8">
            <div 
              onClick={() => requestFormProps.handleRequestTypeSelect("medical_assistance")} 
              className="relative flex-1 border border-primary/30 hover:border-primary transition-all p-8 rounded-lg cursor-pointer group overflow-hidden bg-background"
            >
              <div className="absolute inset-0 bg-primary/5 transform scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300 ease-out"></div>
              <div className="relative z-10">
                <Stethoscope className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-serif mb-3 text-elegant">Medical Assistance</h3>
                <p className="text-muted-foreground">
                  Apply for medical treatments, medications, health services, and healthcare support for critical conditions.
                </p>
                <Button className="mt-6 font-serif">
                  Request Medical Aid
                </Button>
              </div>
            </div>
            
            <div 
              onClick={() => requestFormProps.handleRequestTypeSelect("educational_support")} 
              className="relative flex-1 border border-primary/30 hover:border-primary transition-all p-8 rounded-lg cursor-pointer group overflow-hidden bg-background"
            >
              <div className="absolute inset-0 bg-primary/5 transform scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300 ease-out"></div>
              <div className="relative z-10">
                <GraduationCap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-serif mb-3 text-elegant">Educational Support</h3>
                <p className="text-muted-foreground">
                  Apply for school fees, learning materials, educational programs, and academic advancement opportunities.
                </p>
                <Button className="mt-6 font-serif">
                  Request Educational Aid
                </Button>
              </div>
            </div>
          </div>
        ) : !isStaffUser && (
          <div className="border border-primary/20 p-8 rounded-lg bg-card/40 shadow-sm">
            <NewRequestForm
              requestForm={requestFormProps.requestForm}
              setRequestForm={requestFormProps.setRequestForm}
              selectedFiles={requestFormProps.selectedFiles}
              setSelectedFiles={requestFormProps.setSelectedFiles}
              submitting={requestFormProps.submitting}
              setShowNewRequest={requestFormProps.setShowNewRequest}
              handleRequestSubmit={requestFormProps.handleRequestSubmit}
              requestTypeInfo={requestFormProps.requestTypeInfo}
              restrictedTypes={["medical_assistance", "educational_support"]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestSubmissionPage;
