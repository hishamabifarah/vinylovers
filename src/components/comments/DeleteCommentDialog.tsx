import { CommentData } from "@/lib/types";
import LoadingButton from "../LoadingButton";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useDeleteCommentMutation } from "./mutations";
import { useEffect } from "react";

interface DeleteCommentDialogProps {
  comment: CommentData;
  open: boolean;
  onClose: () => void;
}

export default function DeleteCommentDialog({
  comment,
  open,
  onClose,
}: DeleteCommentDialogProps) {
  const mutation = useDeleteCommentMutation();

  // Function to reset body styles safely
  const resetBodyStyles = () => {
    document.body.style.pointerEvents = "";
    document.body.style.overflow = "";
  };

  // Reset body styles when component unmounts or dialog closes
  useEffect(() => {
    // Reset body styles when dialog closes
    if (!open) {
      // Small timeout to let animation complete
      const timer = setTimeout(resetBodyStyles, 200);
      return () => clearTimeout(timer);
    }
    
    // Cleanup on unmount
    return resetBodyStyles;
  }, [open]);

  function handleOpenChange(open: boolean) {
    if (!open && !mutation.isPending) {
      // Only close if not in the middle of a deletion
      onClose();
    }
  }

  // Handle cancel
  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    if (!mutation.isPending) {
      onClose();
    }
  };

  // Handle delete with proper style reset
  const handleDelete = () => {
    mutation.mutate(comment.id, { 
      onSuccess: () => {
        onClose();
        // Ensure styles are reset when deletion succeeds
        setTimeout(resetBodyStyles, 200);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Delete comment?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={handleDelete}
            loading={mutation.isPending}
          >
            Delete
          </LoadingButton>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}