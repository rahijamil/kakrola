import React, { useState, useEffect } from "react";
import { ThreadType } from "@/types/channel";
import Image from "next/image";
import { getProfileById } from "@/lib/queries";
import { ProfileType } from "@/types/user";
import Spinner from "@/components/ui/Spinner";
import { JSONContent } from "novel";
import Link from "next/link";
import { usePathname } from "next/navigation";

const getTextFromContent = (content: JSONContent): string => {
  let text = "";
  if (content.text) {
    text += content.text;
  }
  if (content.content) {
    content.content.forEach((element) => {
      text += getTextFromContent(element);
    });
  }
  return text;
};

const ThreadCard = ({
  thread,
  channel_slug,
}: {
  thread: ThreadType;
  channel_slug: string;
}) => {
  const [threadProfile, setThreadProfile] = useState<ProfileType | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchThreadProfile = async () => {
      const profile = await getProfileById(thread.profile_id);
      setThreadProfile(profile);
    };
    fetchThreadProfile();
  }, [thread.profile_id]);

  if (!threadProfile) {
    return <Spinner color="current" size="sm" />;
  }

  const content: JSONContent = JSON.parse(thread.content as any);
  const textContent = getTextFromContent(content);
  const firstChars = textContent.substring(0, 50);

  return (
    <Link
      href={`/app/ch/${channel_slug}/th/${thread.slug}`}
      className={`flex gap-2 w-full transition p-4 cursor-pointer border-r-4 ${
        pathname === `/app/ch/${channel_slug}/th/${thread.slug}`
          ? "bg-primary-50 border-primary-200"
          : "hover:bg-primary-10 border-transparent"
      }`}
    >
      <Image
        src={threadProfile?.avatar_url || "/default_avatar.png"}
        alt={threadProfile?.full_name || ""}
        width={36}
        height={36}
        className="rounded-lg w-9 h-9 min-w-9 min-h-9 object-cover"
      />

      <div>
        <h2 className="font-medium line-clamp-1">{thread.title}</h2>

        <p className="text-text-500 text-xs line-clamp-1">
          {threadProfile.full_name} : {firstChars}
        </p>
      </div>
    </Link>
  );
};

export default ThreadCard;
