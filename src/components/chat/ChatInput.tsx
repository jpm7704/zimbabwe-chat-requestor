
import { FormEvent, useState } from "react";
import { Send, PaperclipIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (e?: React.FormEvent) => void;
}

const ChatInput = ({ inputMessage, setInputMessage, handleSendMessage }: ChatInputProps) => {
  return (
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
  );
};

export default ChatInput;
