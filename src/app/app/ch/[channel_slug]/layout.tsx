import { ReactNode } from "react";
import ThreadSidebar from "./ThreadSidebar";

interface ChannelLayoutProps {
  children: ReactNode;
  params: { channel_slug: string };
}

export default function ChannelLayout({
  children,
  params: { channel_slug },
}: ChannelLayoutProps) {
  return (
    <div className="flex h-full">
      <ThreadSidebar channel_slug={channel_slug} />

      {children}
    </div>
  );
}
