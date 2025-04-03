"use client"

import React, { useCallback, useMemo , useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { ImageIcon, Loader2, X } from "lucide-react"
import Image from "next/image"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSubmitVinylMutation } from "./mutations"
import LoadingButton from "@/components/LoadingButton"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HashtagsInput } from "@/components/HashtagsInput"
import useMediaUpload, { type Attachment } from "@/components/vinyls/useMediaUpload"
import { useToast } from "@/components/ui/use-toast";

const vinylSchema = z.object({
  artist: z.string().min(1, "Required"),
  album: z.string().min(1, "Required"),
  genreId: z.string().min(1, "Required"),
  hashtags: z.string().optional(),
  mediaIds: z.array(z.string())

  .max(6, "Cannot have more than 6 attachments"),
})

type NewVinylValues = z.infer<typeof vinylSchema>

interface Genre {
  id: string
  name: string
}

interface AddVinylFormProps {
  genres: Genre[]
}

interface AttachmentPreviewsProps {
  attachments: Attachment[]
  removeAttachment: (mediaId: string) => void
}

const AddVinylForm: React.FC<AddVinylFormProps> = React.memo(({ genres }) => {
  const mutation = useSubmitVinylMutation();
   const { toast } = useToast();

  const {
    attachments,
    isUploading,
    removeAttachment,
    reset: resetMediaUpload,
    startUpload,
    uploadProgress,
  } = useMediaUpload()

  const form = useForm<NewVinylValues>({
    resolver: zodResolver(vinylSchema),
    defaultValues: {
      artist: "",
      album: "",
      genreId: "",
      hashtags: "",
      mediaIds: [],
    },
  })

  useEffect(() => {
    const mediaIds = attachments.filter((a) => a.mediaId).map((a) => a.mediaId as string)
    form.setValue("mediaIds", mediaIds)
  }, [attachments, form])

  const onSubmit = useCallback(
    (values: NewVinylValues) => {
      console.log('values', values);
      if (values.mediaIds.length === 0) {
        toast({
          variant: "destructive",
          description: "Add at least one Image.",
        });
        return; // Prevent form submission
      }

      mutation.mutate(values, {
        onSuccess: () => {
          resetMediaUpload()
          form.reset()
        },
      })
    },
    [mutation, resetMediaUpload, form],
  )

  const memoizedAttachments = useMemo(() => attachments, [attachments])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="artist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Artist</FormLabel>
                <FormControl>
                  <Input placeholder="Artist" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="album"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Album Title</FormLabel>
                <FormControl>
                  <Input placeholder="Album Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="genreId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hashtags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hashtags</FormLabel>
              <FormControl>
                <HashtagsInput value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          name="mediaIds"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <FormLabel className="flex-shrink-0">Images/Videos</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <AddAttachmentsButton
                      onFilesSelected={startUpload}
                      disabled={isUploading || memoizedAttachments.length >= 6}
                    />
                    {isUploading && (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">{uploadProgress ?? 0}%</span>
                      </div>
                    )}
                  </div>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {memoizedAttachments.length > 0 && (
          <div className="space-y-4">
            <AttachmentPreviews
              attachments={memoizedAttachments.filter((a) => a.file.type.startsWith("image"))}
              removeAttachment={removeAttachment}
            />
            <AttachmentPreviews
              attachments={memoizedAttachments.filter((a) => a.file.type.startsWith("video"))}
              removeAttachment={removeAttachment}
            />
          </div>
        )}

        <div>
          <LoadingButton loading={mutation.isPending} type="submit" disabled={isUploading} className="w-full text-white">
            Add Vinyl
          </LoadingButton>
        </div>
      </form>
    </Form>
  )
})

// Existing attachment preview component
interface ExistingAttachmentPreviewProps {
  attachment: {
    id: string
    url: string
    type: string
  }
  onRemoveClick: () => void
}

const ExistingAttachmentPreview = React.memo(
  ({ attachment, onRemoveClick }: ExistingAttachmentPreviewProps) => {
    const isImage = attachment.type === "IMAGE"
    
    return (
      <div className="relative">
        {isImage ? (
          <Image
            src={attachment.url || "/placeholder.svg"}
            alt="Attachment preview"
            width={500}
            height={500}
            className="w-full h-auto aspect-square object-cover rounded-lg"
          />
        ) : (
          <video controls className="w-full h-auto aspect-square object-cover rounded-lg">
            <source src={attachment.url} type="video/mp4" />
          </video>
        )}
        <button
          onClick={onRemoveClick}
          className="absolute right-2 top-2 rounded-full bg-foreground p-1 text-background transition-colors hover:bg-foreground/60"
        >
          <X size={16} />
        </button>
      </div>
    )
  }
)

ExistingAttachmentPreview.displayName = "ExistingAttachmentPreview"

AddVinylForm.displayName = "AddVinylForm"

const AddAttachmentsButton = React.memo(
  ({ onFilesSelected, disabled }: { onFilesSelected: (files: File[]) => void; disabled: boolean }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleButtonClick = useCallback((e: React.MouseEvent) => {
      e.preventDefault()
      fileInputRef.current?.click()
    }, [])

    const handleFileChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length) {
          onFilesSelected(files)
          e.target.value = ""
        }
      },
      [onFilesSelected],
    )

    return (
      <>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-primary hover:text-primary"
          disabled={disabled}
          onClick={handleButtonClick}
        >
          <ImageIcon size={20} />
        </Button>
        <input
          type="file"
          accept="image/*, video/*"
          multiple
          ref={fileInputRef}
          className="sr-only hidden"
          onChange={handleFileChange}
        />
      </>
    )
  },
)

AddAttachmentsButton.displayName = "AddAttachmentsButton"

const AttachmentPreviews = React.memo(({ attachments, removeAttachment }: AttachmentPreviewsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClick={() => removeAttachment(attachment.file.name)}
        />
      ))}
    </div>
  )
})

AttachmentPreviews.displayName = "AttachmentPreviews"

interface AttachmentPreviewProps {
  attachment: Attachment
  onRemoveClick: () => void
}

const AttachmentPreview = React.memo(
  ({ attachment: { file, mediaId, isUploading }, onRemoveClick }: AttachmentPreviewProps) => {
    const src = useMemo(() => URL.createObjectURL(file), [file])

    return (
      <div className={cn("relative", isUploading && "opacity-50")}>
        {file.type.startsWith("image") ? (
          <Image
            src={src || "/placeholder.svg"}
            alt="Attachment preview"
            width={500}
            height={500}
            className="w-full h-auto aspect-square object-cover rounded-lg"
          />
        ) : (
          <video controls className="w-full h-auto aspect-square object-cover rounded-lg">
            <source src={src} type={file.type} />
          </video>
        )}
        {!isUploading && (
          <button
            onClick={onRemoveClick}
            className="absolute right-2 top-2 rounded-full bg-foreground p-1 text-background transition-colors hover:bg-foreground/60"
          >
            <X size={16} />
          </button>
        )}
      </div>
    )
  },
)

AttachmentPreview.displayName = "AttachmentPreview"

export default AddVinylForm




