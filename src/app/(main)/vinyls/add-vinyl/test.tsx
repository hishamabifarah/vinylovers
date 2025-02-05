"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { cn } from "@/lib/utils"

import { ImageIcon, Loader2, X } from "lucide-react"
import Image from "next/image"
import { useRef, useEffect } from "react"
import React, { useCallback, useMemo } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSubmitVinylMutation } from "./mutations"
import LoadingButton from "@/components/LoadingButton"
import { Button } from "@/components/ui/button"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { HashtagsInput } from "@/components/HashtagsInput"
import useMediaUpload, { type Attachment } from "@/components/vinyls/useMediaUpload"

const vinylSchema = z.object({
  artist: z.string().min(1, "Required"),
  album: z.string().min(1, "Required"),
  genreId: z.string().min(1, "Required"),
  hashtags: z.string().optional(),
  mediaIds: z.array(z.string()).max(5, "cannot have more than 5 attachments"),
})

type NewVinylValues = z.infer<typeof vinylSchema>

interface Genre {
  id: string
  name: string
}

interface AddVinylFormProps {
  genres: Genre[]
}

export default function AddVinylForm({ genres }: AddVinylFormProps) {
  const mutation = useSubmitVinylMutation()

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
      mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
    },
  })

  useEffect(() => {
    const mediaIds = attachments.filter((a) => a.mediaId).map((a) => a.mediaId as string)
    form.setValue("mediaIds", mediaIds)
  }, [attachments, form])

  const onSubmit = useCallback(
    
    (values: NewVinylValues) => {
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="genreId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre.id} value={genre.id}>
                          {genre.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="">
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
        </div>

        <div className="">
          <FormField
            control={form.control}
            name="mediaIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images/Videos</FormLabel>
                <FormControl>
                  <div>
                    <AddAttachmentsButton
                      onFilesSelected={startUpload}
                      disabled={isUploading || attachments.length >= 5}
                    />
                    {field.value.length > 0 && (
                      <p className="mt-2 text-sm text-muted-foreground">{field.value.length} file(s) selected</p>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!!attachments.length && <AttachmentPreviews attachments={attachments} removeAttachment={removeAttachment} />}

        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}

        <LoadingButton loading={mutation.isPending} type="submit" disabled={isUploading} className="w-full">
          Add Vinyl
        </LoadingButton>
      </form>
    </Form>
  )
}

interface AddAttachmentsButtonProps {
  onFilesSelected: (files: File[]) => void
  disabled: boolean
}

function AddAttachmentsButton({ onFilesSelected, disabled }: AddAttachmentsButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    fileInputRef.current?.click()
  }

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
        onChange={(e) => {
          const files = Array.from(e.target.files || [])
          if (files.length) {
            onFilesSelected(files)
            e.target.value = ""
          }
        }}
      />
    </>
  )
}

interface AttachmentPreviewsProps {
  attachments: Attachment[]
  removeAttachment: (fileName: string) => void
}

function AttachmentPreviews({ attachments, removeAttachment }: AttachmentPreviewsProps) {
  return (
    <div className={cn("flex flex-col gap-3", attachments.length > 1 && "sm:grid sm:grid-cols-2")}>
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClick={() => removeAttachment(attachment.file.name)}
        />
      ))}
    </div>
  )
}

interface AttachmentPreviewProps {
  attachment: Attachment
  onRemoveClick: () => void
}

function AttachmentPreview({ attachment: { file, mediaId, isUploading }, onRemoveClick }: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file)

  return (
    <div className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}>
      {file.type.startsWith("image") ? (
        <Image
          src={src || "/placeholder.svg"}
          alt="Attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
        >
          <X size={20} />
        </button>
      )}
    </div>
  )
}

