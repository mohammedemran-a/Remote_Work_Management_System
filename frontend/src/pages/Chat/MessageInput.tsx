// src/pages/Chat/MessageInput.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip } from "lucide-react";

interface MessageInputProps {
  messageText: string;
  onMessageChange: (text: string) => void;
  onSendMessage: () => void;
  onFileUpload: () => void;
}

export const MessageInput = ({
  messageText,
  onMessageChange,
  onSendMessage,
  onFileUpload,
}: MessageInputProps) => {
  return (
    <div className="p-4 border-t border-border">
      <div className="flex items-end gap-2">
        <Button size="icon" variant="ghost" onClick={onFileUpload} className="mb-1">
          <Paperclip className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <Input
            placeholder="اكتب رسالتك هنا..."
            value={messageText}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            className="min-h-[44px]"
          />
        </div>
        <Button onClick={onSendMessage} className="mb-1">
          <Send className="h-5 w-5 ml-2" />
          إرسال
        </Button>
      </div>
    </div>
  );
};
