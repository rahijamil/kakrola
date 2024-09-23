import { defaultExtensions } from "@/components/NovelEditor/extensions";
import { ProfileType } from "@/types/user";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, SmilePlus } from "lucide-react";
import Image from "next/image";
import { EditorContent, JSONContent } from "novel";
import React from "react";

const ReplyCard = ({
  profile,
  created_at,
  is_edited,
  content,
}: {
  profile: ProfileType;
  created_at: string;
  is_edited: boolean;
  content: JSONContent;
}) => {
  return (
    <div className="relative group">
      <div className="flex gap-4">
        <div>
          <Image
            src={profile?.avatar_url || ""}
            alt={profile?.full_name || ""}
            width={36}
            height={36}
            className="rounded-lg w-9 h-9 min-w-9 min-h-9 object-cover"
          />
        </div>

        <div>
          <div className="flex gap-1 items-center">
            <h3 className="font-bold">{profile?.full_name}</h3>
            <p className="text-xs text-text-500">
              {formatDistanceToNow(new Date(created_at!))}
              {is_edited && " (edited)"}
            </p>
          </div>

          <EditorContent
            editable={false}
            initialContent={JSON.parse(content as any)}
            extensions={defaultExtensions}
          />
        </div>
      </div>

      <ul className="absolute -top-2 right-0 hidden group-hover:flex items-center gap-1 bg-background rounded-lg">
        <li>
          <button className="p-1.5 rounded-md hover:bg-text-100">
            <SmilePlus strokeWidth={1.5} className="w-5 h-5" />
          </button>
        </li>
        <li>
          <button className="p-1.5 rounded-md hover:bg-text-100">
            <MoreVertical strokeWidth={1.5} className="w-5 h-5" />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ReplyCard;
