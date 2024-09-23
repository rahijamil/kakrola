import React, { useState, useEffect } from "react";
import { ThreadType } from "@/types/channel";
import Image from "next/image";
import { getProfileById } from "@/lib/queries";
import { ProfileType } from "@/types/user";
import Spinner from "@/components/ui/Spinner";
import { JSONContent } from "novel";
import Link from "next/link";

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

  useEffect(() => {
    const fetchThreadProfile = async () => {
      const profile = await getProfileById(thread.profile_id);
      setThreadProfile(profile);
    };
    fetchThreadProfile();
  }, [thread.profile_id]);

  if (!threadProfile) {
    return <Spinner color="primary" size="sm" />;
  }

  const content: JSONContent = JSON.parse(thread.content as any);
  const textContent = getTextFromContent(content);
  const first100Chars = textContent.substring(0, 100);

  return (
    <Link
      href={`/app/ch/${channel_slug}/th/${thread.slug}`}
      className="flex items-center gap-2 w-full hover:bg-primary-50 border border-transparent hover:border-primary-200 transition py-4 px-6 rounded-lg cursor-pointer"
    >
      <Image
        src={threadProfile?.avatar_url || "/default_avatar.png"}
        alt={threadProfile?.full_name || ""}
        width={36}
        height={36}
        className="rounded-lg w-9 h-9 min-w-9 min-h-9 object-cover"
      />

      <div>
        <h2 className="font-bold">{thread.title}</h2>

        <p className="flex gap-1 text-xs whitespace-nowrap text-text-500">
          {threadProfile.full_name} : {first100Chars}{" "}
          {textContent.length > 100 ? "..." : ""}
        </p>
      </div>
    </Link>
  );
};

export default ThreadCard;
