import { StreamChat } from "stream-chat";

const streamServerClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_KEY!, // ! means assert that this is not null
  process.env.STREAM_SECRET,
);

export default streamServerClient;