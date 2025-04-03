import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";

export interface Attachment {
  file: File; // file we select, we get the file immediatly
  mediaId?: string; // optional because we get mediaId after upload finished
  isUploading: boolean;
}

// upload logic for media attachments
export default function useMediaUpload() {
  const { toast } = useToast();

  const [attachments, setAttachments] = useState<Attachment[]>([]); // initialized with empty array

  const [uploadProgress, setUploadProgress] = useState<number>();

  // "attachment" endpoint in core.ts
  const { startUpload, isUploading } = useUploadThing("attachment", {
    // callback where we get passed each file
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop(); 
        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extension}`,
          {
            type: file.type,
          },
        );
      });

      setAttachments((prev) => [
        ...prev, // previous attachments if added attachments earlier
        ...renamedFiles.map((file) => ({ file, isUploading: true })), // take each renamed file and turn them into attachment
      ]);

      return renamedFiles;
    },
    onUploadProgress: setUploadProgress,

    // res contains multiple files cause we upload many ones at the same time
    onClientUploadComplete(res) {
      setAttachments((prev) =>
        prev.map((a) => {
          const uploadResult = res.find((r) => r.name === a.file.name); // find upload result for each attachment

          if (!uploadResult) return a; // return attachment as it is , there is no mediaId to add to it

          // return an attachement , override the mediaId and set isUploading to false
          return {
            ...a,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        }),
      );
    },
    onUploadError(e) {
        // is usuploaing rue means they were uploading and we remove them, keep only file if isUploading is false
      setAttachments((prev) => prev.filter((a) => !a.isUploading)); 
      toast({
        variant: "destructive",
        description: e.message,
      });
    },
  });

  // upload progrees will misbehave if we trigger 2 multiple uploads at the same time
  // to avoid this we allow one upload with many images at a time 
  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Please wait for the current upload to finish.",
      });
      return;
    }

    if (attachments.length + files.length > 6) {
      toast({
        variant: "destructive",
        description: "You can only upload up to 6 attachments per vinyl.",
      });
      return;
    }

    startUpload(files);
  }

  function removeAttachment(fileName: string) {
    // keep attachments where file names are not equal to the filename passed 
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName)); 
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
  };
}