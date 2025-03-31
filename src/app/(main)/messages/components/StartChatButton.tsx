"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useState } from "react"
import NewChatDialog from "../NewChatDialog"
import { useRouter } from "next/navigation"

interface StartChatButtonProps extends ButtonProps {
  username?: string
  variant?: "default" | "secondary"
}

export default function StartChatButton({
  username = "",
  variant = "default",
  className,
  ...props
}: StartChatButtonProps) {
  const [showDialog, setShowDialog] = useState(false)
  const router = useRouter()

  const handleChatCreated = () => {
    setShowDialog(false)
    router.push("/messages")
  }

  if (variant === "secondary") {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className={className}
          onClick={() => setShowDialog(true)}
          title="Start chat"
          {...props}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>

        {showDialog && (
          <NewChatDialog onOpenChange={setShowDialog} onChatCreated={handleChatCreated} initialSearchTerm={username} />
        )}
      </>
    )
  }

  return (
    <>
      <Button variant="outline" size="sm" className={className} onClick={() => setShowDialog(true)} {...props}>
        <MessageSquare className="mr-2 h-4 w-4" />
        Message
      </Button>

      {showDialog && (
        <NewChatDialog onOpenChange={setShowDialog} onChatCreated={handleChatCreated} initialSearchTerm={username} />
      )}
    </>
  )
}

