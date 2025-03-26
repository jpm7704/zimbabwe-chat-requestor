
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRequestForm } from "@/hooks/useRequestForm";
import NewRequestForm from "@/components/request/NewRequestForm";
import { FileText, Send, Stethoscope, GraduationCap } from "lucide-react";

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
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-3 text-elegant">Support Request</h1>
          <p className="text-muted-foreground font-serif text-lg">
            Empowering the vulnerable through sustainable development initiatives
          </p>
        </div>

        {!showNewRequest ? (
          <div className="flex flex-col md:flex-row gap-6 mt-8">
            <div 
              onClick={() => {
                setShowNewRequest(true);
                requestFormProps.setRequestForm(prev => ({
                  ...prev,
                  type: "medical_assistance"
                }));
              }} 
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
              onClick={() => {
                setShowNewRequest(true);
                requestFormProps.setRequestForm(prev => ({
                  ...prev,
                  type: "educational_support"
                }));
              }} 
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
        ) : (
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
        
        {/* Information about the request process with elegant styling */}
        <div className="mt-8 bg-secondary/20 p-8 rounded-lg border border-primary/10">
          <h3 className="text-2xl font-serif mb-4 text-elegant">Our Support Process</h3>
          <ol className="space-y-4 font-serif text-lg">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary font-serif mr-3 mt-0.5 flex-shrink-0">1</span>
              <span>Complete the support request form with accurate and detailed information</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary font-serif mr-3 mt-0.5 flex-shrink-0">2</span>
              <span>Upload all required documents to strengthen your application</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary font-serif mr-3 mt-0.5 flex-shrink-0">3</span>
              <span>Submit your request for assessment by our dedicated team</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary font-serif mr-3 mt-0.5 flex-shrink-0">4</span>
              <span>Our field officers will contact you for verification and further information</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary font-serif mr-3 mt-0.5 flex-shrink-0">5</span>
              <span>Based on the assessment, appropriate support will be provided</span>
            </li>
          </ol>
        </div>

        {/* Community impact section */}
        <div className="mt-4 bg-primary/5 p-8 rounded-lg border border-primary/10">
          <h3 className="text-2xl font-serif mb-4 text-elegant">Our Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h4 className="text-xl font-serif text-elegant">Medical Assistance Impact</h4>
              <p className="text-muted-foreground font-serif">
                In the past year, our medical assistance program has helped over 500 individuals 
                access critical healthcare services, life-saving medications, and specialized 
                treatments across Zimbabwe.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Patients Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">Healthcare Facilities</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-xl font-serif text-elegant">Educational Support Impact</h4>
              <p className="text-muted-foreground font-serif">
                Our educational initiatives have enabled 750 students to continue their education 
                through school fee assistance, learning materials, and educational programs focused 
                on sustainable development.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">750+</div>
                  <div className="text-sm text-muted-foreground">Students Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">35</div>
                  <div className="text-sm text-muted-foreground">Schools Partnered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestSubmissionPage;
