import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import {
  Channel,
  ChannelHeader,
  ChannelHeaderProps,
  MessageInput,
  MessageList,
  useChatContext,
  Window,
} from "stream-chat-react";
import CustomChatHeader from "./components/CustomChatHeader";

interface ChatChannelProps {
  open: boolean;
  openSidebar: () => void;
}

export default function ChatChannel({ open, openSidebar }: ChatChannelProps) {
  const { channel } = useChatContext();

  return (
    <div className={cn("w-full flex flex-col", !open && "md:hidden")}>
      {channel ? (
        <div className={cn("flex-1", !open && "hidden md:block")}>
          {/* Active chat UI */}
          <Channel>
            <Window>
              <CustomChatHeader/>
              <CustomChannelHeader openSidebar={openSidebar} />
              <MessageList />
              <MessageInput />
            </Window>
          </Channel>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-4">
          <p className="text-center text-muted-foreground">
            No active chat. Select a chat or start a new conversation!
          </p>
          <Button
            className="text-white mt-5"
            variant="default"
            onClick={() => {
              // Trigger the new chat dialog
              const newChatDialog = document.querySelector("#new-chat-dialog") as HTMLElement | null;
              if (newChatDialog) {
                newChatDialog.click();
              }
            }}
          >
            Start New Chat
          </Button>
        </div>
      )}
    </div>
  );
}

interface CustomChannelHeaderProps extends ChannelHeaderProps {
  openSidebar: () => void;
}

function CustomChannelHeader({
  openSidebar,
  ...props
}: CustomChannelHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-full p-2 md:hidden">
        <Button size="icon" variant="ghost" onClick={openSidebar}>
          <Menu className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />
    </div>
  );
}