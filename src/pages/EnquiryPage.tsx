
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRequestForm } from "@/hooks/useRequestForm";
import NewRequestForm from "@/components/request/NewRequestForm";
import { 
  MessageCircle, 
  HelpCircle, 
  AlertCircle, 
  HomeIcon,
  UtensilsIcon, 
  DropletIcon,
  UsersIcon,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const EnquiryPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, userProfile } = useAuth();
  const { isRegularUser } = useRoles(userProfile);
  const { toast } = useToast();
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
      toast({
        title: "Access restricted",
        description: "Only regular users can submit enquiries",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [userProfile, navigate, isRegularUser, toast]);

  useEffect(() => {
    const type = searchParams.get("type");
    
    if (isAuthenticated) {
      setShowNewRequest(true);
      
      if (type) {
        requestFormProps.setRequestForm(prev => ({
          ...prev,
          type,
          isEnquiry: true
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
          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              onClick={() => requestFormProps.handleRequestTypeSelect("shelter_assistance")} 
              className="border border-primary/30 hover:border-primary transition-all p-6 rounded-lg cursor-pointer hover:bg-primary/5"
            >
              <HomeIcon className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-serif mb-2">Shelter Assistance</h3>
              <p className="text-sm text-muted-foreground">
                Enquire about housing support and shelter improvement programs.
              </p>
            </div>
            
            <div 
              onClick={() => requestFormProps.handleRequestTypeSelect("food_assistance")} 
              className="border border-primary/30 hover:border-primary transition-all p-6 rounded-lg cursor-pointer hover:bg-primary/5"
            >
              <UtensilsIcon className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-serif mb-2">Food Assistance</h3>
              <p className="text-sm text-muted-foreground">
                Learn about food security initiatives and nutrition programs.
              </p>
            </div>
            
            <div 
              onClick={() => requestFormProps.handleRequestTypeSelect("water_sanitation")} 
              className="border border-primary/30 hover:border-primary transition-all p-6 rounded-lg cursor-pointer hover:bg-primary/5"
            >
              <DropletIcon className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-serif mb-2">Water & Sanitation</h3>
              <p className="text-sm text-muted-foreground">
                Enquire about clean water access and sanitation support.
              </p>
            </div>
            
            <div 
              onClick={() => requestFormProps.handleRequestTypeSelect("community_development")} 
              className="border border-primary/30 hover:border-primary transition-all p-6 rounded-lg cursor-pointer hover:bg-primary/5"
            >
              <UsersIcon className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-serif mb-2">Community Development</h3>
              <p className="text-sm text-muted-foreground">
                Information about community empowerment initiatives.
              </p>
            </div>
            
            <div 
              onClick={() => requestFormProps.handleRequestTypeSelect("disaster_relief")} 
              className="border border-primary/30 hover:border-primary transition-all p-6 rounded-lg cursor-pointer hover:bg-primary/5"
            >
              <AlertTriangle className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-serif mb-2">Emergency Relief</h3>
              <p className="text-sm text-muted-foreground">
                Information about disaster response and emergency aid.
              </p>
            </div>
            
            <div 
              onClick={() => requestFormProps.handleRequestTypeSelect("general_enquiry")} 
              className="border border-primary/30 hover:border-primary transition-all p-6 rounded-lg cursor-pointer hover:bg-primary/5"
            >
              <HelpCircle className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-serif mb-2">General Enquiry</h3>
              <p className="text-sm text-muted-foreground">
                Any other questions about our programs and services.
              </p>
            </div>
          </div>
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
