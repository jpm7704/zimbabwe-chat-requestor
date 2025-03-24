
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Custom hooks
import { useChatMessages } from "@/hooks/useChatMessages";
import { useRequestForm } from "@/hooks/useRequestForm";

// Components
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import NewRequestForm from "@/components/request/NewRequestForm";

const ChatInterface = () => {
  const location = useLocation();
  
  // Chat functionality
  const {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isTyping,
    handleSendMessage
  } = useChatMessages();
  
  // Request form functionality
  const {
    showNewRequest,
    setShowNewRequest,
    requestForm,
    setRequestForm,
    selectedFiles,
    setSelectedFiles,
    requestTypeInfo,
    submitting,
    handleRequestSubmit
  } = useRequestForm(setMessages);
  
  const [activeTab, setActiveTab] = useState("chat");

  useEffect(() => {
    // Check if there's a request type in the URL
    const params = new URLSearchParams(location.search);
    const requestType = params.get("type");
    if (requestType) {
      setShowNewRequest(true);
      setRequestForm(prev => ({ ...prev, type: requestType }));
      setActiveTab("request");
    }
  }, [location.search]);

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
                <ChatMessages messages={messages} isTyping={isTyping} />
                
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
                <ChatInput 
                  inputMessage={inputMessage}
                  setInputMessage={setInputMessage}
                  handleSendMessage={handleSendMessage}
                />
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="request" className="animate-fade-in">
            <Card className="border rounded-xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Submit a New Request</h2>
                <NewRequestForm 
                  requestForm={requestForm}
                  setRequestForm={setRequestForm}
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  submitting={submitting}
                  setShowNewRequest={setShowNewRequest}
                  handleRequestSubmit={handleRequestSubmit}
                  requestTypeInfo={requestTypeInfo}
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChatInterface;
