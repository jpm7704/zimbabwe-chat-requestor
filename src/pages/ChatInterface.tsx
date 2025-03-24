
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage as ChatMessageType, RequestType } from "@/types";
import { 
  Send, 
  PaperclipIcon, 
  UploadCloud, 
  X, 
  ArrowRight,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getChatHistory, sendMessage } from "@/services/chatService";
import { createRequest, getRequestTypeInfo } from "@/services/requestService";
import { RequestTypeInfo } from "@/types";

const ChatInterface = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [requestForm, setRequestForm] = useState<{
    type: string;
    title: string;
    description: string;
  }>({
    type: "",
    title: "",
    description: ""
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [requestTypeInfo, setRequestTypeInfo] = useState<RequestTypeInfo | null>(null);
  const [requestTypeOptions, setRequestTypeOptions] = useState<{ value: string, label: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await getChatHistory();
        setMessages(history);
      } catch (error) {
        console.error("Error loading chat history:", error);
        toast({
          title: "Error",
          description: "Failed to load chat history. Please try again.",
          variant: "destructive",
        });
      }
    };

    loadChatHistory();

    // Check if there's a request type in the URL
    const params = new URLSearchParams(location.search);
    const requestType = params.get("type");
    if (requestType) {
      setShowNewRequest(true);
      setRequestForm(prev => ({ ...prev, type: requestType }));
      loadRequestTypeInfo(requestType);
      setActiveTab("request");
    }
  }, [location.search, toast]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const newMessage: ChatMessageType = {
      id: Date.now().toString(),
      senderId: "user",
      senderType: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    setIsTyping(true);
    
    try {
      const response = await sendMessage(inputMessage);
      
      // Slight delay to simulate typing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadRequestTypeInfo = async (type: string) => {
    try {
      const info = await getRequestTypeInfo(type as any);
      if (info) {
        setRequestTypeInfo(info);
      }
    } catch (error) {
      console.error("Error loading request type info:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!requestForm.type || !requestForm.title || !requestForm.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if required documents are uploaded
    const requiredDocCount = requestTypeInfo?.requiredDocuments.filter(doc => doc.required).length || 0;
    if (selectedFiles.length < requiredDocCount) {
      toast({
        title: "Documents required",
        description: `Please upload all required documents (${requiredDocCount} required).`,
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Cast the string type to RequestType before submitting
      const result = await createRequest({
        type: requestForm.type as RequestType,
        title: requestForm.title,
        description: requestForm.description
      });
      
      // In a real app, we would now upload the files
      // For this demo, we'll just simulate success
      
      toast({
        title: "Request submitted successfully",
        description: `Your request has been submitted with ticket number ${result.ticketNumber}.`,
      });
      
      // Add a message to the chat
      const newMessage: ChatMessageType = {
        id: Date.now().toString(),
        senderId: "system",
        senderType: "system",
        content: `Your request has been submitted successfully! Your ticket number is **${result.ticketNumber}**. You can track the status of your request in the Requests section.`,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Reset form
      setRequestForm({
        type: "",
        title: "",
        description: ""
      });
      setSelectedFiles([]);
      setShowNewRequest(false);
      
      // Navigate to the request
      setTimeout(() => {
        navigate(`/requests/${result.requestId}`);
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const ChatMessage = ({ message }: { message: ChatMessageType }) => {
    return (
      <div 
        className={`flex flex-col max-w-[80%] ${
          message.senderType === "user" ? "items-end ml-auto" : "items-start"
        } mb-4 animate-fade-in`}
      >
        <div className={`px-4 py-3 rounded-2xl ${
          message.senderType === "user" 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-secondary text-secondary-foreground rounded-tl-none"
        }`}>
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
        <div className={`text-xs text-muted-foreground mt-1 ${
          message.senderType === "user" ? "text-right" : "text-left"
        }`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    );
  };

  const NewRequestForm = () => {
    return (
      <form onSubmit={handleRequestSubmit} className="space-y-4 animate-fade-in">
        <div>
          <label htmlFor="requestType" className="block text-sm font-medium mb-1">
            Request Type <span className="text-destructive">*</span>
          </label>
          <select
            id="requestType"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={requestForm.type}
            onChange={(e) => {
              setRequestForm(prev => ({ ...prev, type: e.target.value }));
              loadRequestTypeInfo(e.target.value);
            }}
            required
          >
            <option value="">Select Request Type</option>
            <option value="medical_assistance">Medical Assistance</option>
            <option value="educational_support">Educational Support</option>
            <option value="financial_aid">Financial Aid</option>
            <option value="food_assistance">Food Assistance</option>
            <option value="shelter_assistance">Shelter Assistance</option>
            <option value="water_sanitation">Water & Sanitation</option>
            <option value="psychosocial_support">Psychosocial Support</option>
            <option value="disaster_relief">Disaster Relief</option>
            <option value="other_assistance">Other Assistance</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="requestTitle" className="block text-sm font-medium mb-1">
            Request Title <span className="text-destructive">*</span>
          </label>
          <Input
            id="requestTitle"
            placeholder="Enter a title for your request"
            value={requestForm.title}
            onChange={(e) => setRequestForm(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <label htmlFor="requestDescription" className="block text-sm font-medium mb-1">
            Description <span className="text-destructive">*</span>
          </label>
          <Textarea
            id="requestDescription"
            placeholder="Describe your request in detail"
            rows={4}
            value={requestForm.description}
            onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>
        
        {requestTypeInfo && (
          <div className="border border-border rounded-md p-4 bg-secondary/50">
            <h4 className="font-medium mb-2">Required Documents</h4>
            <ul className="space-y-2 mb-4">
              {requestTypeInfo.requiredDocuments.map((doc, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary mr-2 mt-0.5">
                    {doc.required ? 'Required' : 'Optional'}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{doc.name}</p>
                    <p className="text-muted-foreground text-xs">{doc.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            
            <div>
              <label htmlFor="fileUpload" className="block text-sm font-medium mb-2">
                Upload Documents <span className="text-destructive">*</span>
              </label>
              <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-md p-6 transition-colors hover:border-primary/50 cursor-pointer">
                <label htmlFor="fileUpload" className="cursor-pointer text-center">
                  <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supported formats: PDF, DOCX, JPEG, PNG</p>
                  <input
                    id="fileUpload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium mb-2">Selected Files ({selectedFiles.length})</h5>
                <ul className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-secondary/80 rounded-md p-2 text-sm">
                      <span className="truncate max-w-[200px]">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowNewRequest(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="container px-4 mx-auto max-w-5xl">
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-2">Humanitarian Assistance</h1>
        <p className="text-muted-foreground mb-6">
          Chat with our support team or submit a new request for assistance
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="chat">Chat Support</TabsTrigger>
            <TabsTrigger value="request">New Request</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="animate-fade-in">
            <Card className="border rounded-xl overflow-hidden">
              <div className="h-[60vh] flex flex-col">
                {/* Chat Messages */}
                <div className="flex-grow overflow-y-auto p-4">
                  {messages.map(message => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-center text-muted-foreground text-sm mb-4">
                      <div className="bg-secondary rounded-full p-2 mr-2">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse"></div>
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                        <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Submit a new request prompt */}
                {!showNewRequest && (
                  <div className="mx-4 mb-4">
                    <Button
                      variant="outline"
                      className="w-full border-dashed hover:border-primary/50"
                      onClick={() => {
                        setShowNewRequest(true);
                        setActiveTab("request");
                      }}
                    >
                      Submit a new request
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {/* Chat Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                    >
                      <PaperclipIcon className="h-5 w-5" />
                    </Button>
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="flex-grow"
                    />
                    <Button type="submit" size="icon" className="shrink-0">
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="request" className="animate-fade-in">
            <Card className="border rounded-xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Submit a New Request</h2>
                <NewRequestForm />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChatInterface;
