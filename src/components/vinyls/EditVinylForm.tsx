"use client"

import React, { useCallback, useMemo, useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { ImageIcon, Loader2, X } from "lucide-react"
import Image from "next/image"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import LoadingButton from "@/components/LoadingButton"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HashtagsInput } from "@/components/HashtagsInput"
import useMediaUpload, { type Attachment } from "@/components/vinyls/useMediaUpload"
import { useToast } from "@/components/ui/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateVinyl } from "@/components/vinyls/actions"
import type { VinylData } from "@/lib/types"
import { useUpdateVinyl } from "./mutations"

const vinylSchema = z.object({
  id: z.string(),
  artist: z.string().min(1, "Required"),
  album: z.string().min(1, "Required"),
  genreId: z.string().min(1, "Required"),
  hashtags: z.string().optional(),
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
})

type EditVinylValues = z.infer<typeof vinylSchema>

interface Genre {
  id: string
  name: string
  thumbnail?: string
  vinylCount?: number
}

interface AttachmentPreviewsProps {
  attachments: Attachment[]
  removeAttachment: (mediaId: string) => void
}

// Custom hook for updating vinyl
// function useUpdateVinyl() {
//   const queryClient = useQueryClient()
//   const { toast } = useToast()

//   return useMutation({
//     mutationFn: updateVinyl,
//     onSuccess: (updatedVinyl, variables) => {
//       queryClient.setQueryData(["vinyl", variables.id], updatedVinyl)

//       queryClient.invalidateQueries({ queryKey: ["vinyl", variables.id] })
//       queryClient.invalidateQueries({ queryKey: ["vinyls"] })
//       queryClient.invalidateQueries({
//         queryKey: ["vinyl-feed"],
//         predicate(query) {
//           return query.queryKey.includes("for-you") || query.queryKey.includes("user-vinyls")
//         },
//       })

//       toast({
//         title: "Vinyl updated",
//         description: "Your vinyl has been updated successfully.",
//       })
//     },
//     onError: (error) => {
//       console.error("Error updating vinyl:", error)
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to update vinyl. Please try again.",
//       })
//     },
//   })
// }

interface EditVinylFormProps {
  vinyl: VinylData
  genres: Genre[]
}

const EditVinylForm: React.FC<EditVinylFormProps> = React.memo(({ vinyl, genres }) => {
  const router = useRouter()
  const updateMutation = useUpdateVinyl()
  const [existingAttachments, setExistingAttachments] = useState<any[]>(
    vinyl.attachments.map((attachment) => ({
      id: attachment.id,
      url: attachment.url,
      type: attachment.type,
    })),
  )

  const {
    attachments,
    isUploading,
    removeAttachment,
    reset: resetMediaUpload,
    startUpload,
    uploadProgress,
  } = useMediaUpload()

  const { toast } = useToast()

  const form = useForm<EditVinylValues>({
    resolver: zodResolver(vinylSchema),
    defaultValues: {
      id: vinyl.id,
      artist: vinyl.artist,
      album: vinyl.album,
      genreId: vinyl.genre.id,
      hashtags: vinyl.hashtags || "",
      mediaIds: vinyl.attachments.map((a) => a.id),
    },
  })

  // Update mediaIds when attachments change
  useEffect(() => {
    // Ensure we don't exceed 5 total attachments
    const existingIds = existingAttachments.map((a) => a.id)
    const newIds = attachments.filter((a) => a.mediaId).map((a) => a.mediaId as string)

    // Limit to 5 total attachments
    const totalIds = [...existingIds, ...newIds].slice(0, 5)

    form.setValue("mediaIds", totalIds)
  }, [attachments, existingAttachments, form])

  const onSubmit = useCallback(
    (values: EditVinylValues) => {
      // Ensure mediaIds are up to date before submission and limited to 5
      const existingIds = existingAttachments.map((a) => a.id)
      const newIds = attachments.filter((a) => a.mediaId).map((a) => a.mediaId as string)

      // Limit to 5 total attachments
      const finalMediaIds = [...existingIds, ...newIds].slice(0, 5)

      const finalValues = {
        ...values,
        mediaIds: finalMediaIds,
      }

      console.log("Submitting with mediaIds:", finalValues.mediaIds)

      updateMutation.mutate(finalValues, {
        onSuccess: () => {
          router.push(`/vinyls/${vinyl.id}`)
        },
      })
    },
    [updateMutation, vinyl.id, router, existingAttachments, attachments],
  )

  const handleRemoveExistingAttachment = useCallback((id: string) => {
    setExistingAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const memoizedAttachments = useMemo(() => attachments, [attachments])
  const memoizedExistingAttachments = useMemo(() => existingAttachments, [existingAttachments])

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
                      onFilesSelected={(files) => {
                        const remainingSlots = 5 - memoizedExistingAttachments.length
                        const filesToUpload = files.slice(0, remainingSlots)
                        if (filesToUpload.length > 0) {
                          startUpload(filesToUpload)
                        }
                        if (filesToUpload.length < files.length) {
                          toast({
                            title: "Too many files",
                            description: `Only ${filesToUpload.length} out of ${files.length} files were added. Maximum total is 5 attachments.`,
                            variant: "destructive",
                          })
                        }
                      }}
                      disabled={isUploading || memoizedExistingAttachments.length >= 5}
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

        {/* Existing attachments */}
        {memoizedExistingAttachments.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Existing Media</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {memoizedExistingAttachments.map((attachment) => (
                <ExistingAttachmentPreview
                  key={attachment.id}
                  attachment={attachment}
                  onRemoveClick={() => handleRemoveExistingAttachment(attachment.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* New attachments */}
        {memoizedAttachments.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">New Media</h3>
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

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
          <LoadingButton
            loading={updateMutation.isPending}
            type="submit"
            disabled={isUploading}
            className="flex-1 text-white"
          >
            Update Vinyl
          </LoadingButton>
        </div>
      </form>
    </Form>
  )
})

EditVinylForm.displayName = "EditVinylForm"

// Existing attachment preview component
interface ExistingAttachmentPreviewProps {
  attachment: {
    id: string
    url: string
    type: string
  }
  onRemoveClick: () => void
}

const ExistingAttachmentPreview = React.memo(({ attachment, onRemoveClick }: ExistingAttachmentPreviewProps) => {
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
})

ExistingAttachmentPreview.displayName = "ExistingAttachmentPreview"

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

export default EditVinylForm

