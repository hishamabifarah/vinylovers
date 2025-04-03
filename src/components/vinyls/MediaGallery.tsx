"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export interface Attachment {
    id: string;
    url: string;
    type: "IMAGE" | "VIDEO";
  }

interface MediaGalleryProps {
  items: Attachment[]
   type: "IMAGE" | "VIDEO";
}

export function MediaGallery({ items, type }: MediaGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<Attachment | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[200px]">
        {items.reverse().map((item, i) => (
          <div
            key={item.id}
            className={cn(
              "relative rounded-lg overflow-hidden cursor-pointer",
              // // Span 2 rows for every 3rd item
              // i % 3 === 0 ? "row-span-2" : "",
              // // Span 2 columns for every 5th item
              // i % 5 === 0 ? "md:col-span-2" : "",
            )}
            onClick={() => setSelectedItem(item)}
          >
            {type === "IMAGE" ? (
              <Image
                src={item.url || "/placeholder.svg"}
                alt={item.type === "IMAGE" ? "Image" : "Video"}
                fill
                className="object-cover transition-all hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <video src={item.url} className="w-full h-full object-cover transition-all hover:scale-105" />
            )}
          </div>
        ))}
      </div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-background/80 backdrop-blur-sm">
          {selectedItem && (
            <div className="relative w-full h-full">
              {type === "IMAGE" ? (
                <Image src={selectedItem.url || "/placeholder.svg"} alt="" fill className="object-contain" priority />
              ) : (
                <video src={selectedItem.url} controls className="w-full h-full object-contain" autoPlay />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

