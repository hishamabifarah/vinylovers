// components/chat/DeleteChatDialog.tsx
"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import { useRouter } from "next/navigation";
import kyInstance from "@/lib/ky";

interface DeleteChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteChatDialog({ isOpen, onClose }: DeleteChatDialogProps) {
  const { channel } = useChannelStateContext();
  const { setActiveChannel } = useChatContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  if (!channel) return null;

  const handleDelete = async () => {
    if (!channel) return;

    setIsDeleting(true);
    try {
      // Use our server-side API to delete the channel
      // await kyInstance.delete(`/api/chat/channels/${channel.id}`);

      const destroy = await channel.delete();
      console.log("Delete response:", destroy);
      
      // Clear the active channel
      if (setActiveChannel) {
        setActiveChannel(undefined);
      }
      
      toast({
        description: "Chat deleted successfully",
      });
      
      // Redirect to the main chat page
      router.push("/messages");
      
      // Close the dialog
      onClose();
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete chat. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isDeleting && !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Chat</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this chat? This action cannot be undone and all messages will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <LoadingButton 
            variant="destructive" 
            onClick={handleDelete} 
            loading={isDeleting}
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

