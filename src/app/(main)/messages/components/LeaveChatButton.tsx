// components/chat/LeaveChatButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import { useState } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface LeaveChatButtonProps {
  className?: string;
}

export default function LeaveChatButton({ className }: LeaveChatButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const { channel } = useChannelStateContext();
  const { client, setActiveChannel } = useChatContext();
  const { toast } = useToast();
  const router = useRouter();
  
  // Only show button if user is a channel member
  const currentUserId = client?.userID;
  const isChannelMember = currentUserId && channel?.state?.members?.[currentUserId];
  
  if (!channel || !isChannelMember || !currentUserId) return null;

  const handleLeaveChat = async () => {
    if (!channel || !currentUserId) return;

    setIsLeaving(true);
    try {
      // Remove the current user from the channel
      await channel.removeMembers([currentUserId]);
      
      // Clear the active channel
      if (setActiveChannel) {
        setActiveChannel(undefined);
      }
      
      toast({
        description: "You have left the chat",
      });
      
      // Redirect to the main chat page
      router.push("/messages");
      
      // Close the dialog
      setShowDialog(false);
    } catch (error) {
      console.error("Error leaving chat:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to leave chat. Please try again.",
      });
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={className}
        onClick={() => setShowDialog(true)}
        title="Leave chat"
      >
        <LogOut className="h-5 w-5 text-muted-foreground" />
      </Button>
      
      <Dialog open={showDialog} onOpenChange={(open) => !isLeaving && setShowDialog(open)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Leave Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this chat? You will no longer receive messages from this conversation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setShowDialog(false)} disabled={isLeaving}>
              Cancel
            </Button>
            <LoadingButton 
              variant="default" 
              onClick={handleLeaveChat} 
              loading={isLeaving}
            >
              Leave Chat
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}