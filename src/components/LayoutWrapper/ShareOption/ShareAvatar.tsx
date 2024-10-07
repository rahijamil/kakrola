import Dropdown from "@/components/ui/Dropdown";
import { PersonalMemberForProjectType } from "@/types/team";
import { ProfileType } from "@/types/user";
import Image from "next/image";
import React, { useRef, useState } from "react";

interface MemberData extends PersonalMemberForProjectType {
  profile: ProfileType;
}

const ShareAvatar = ({ member }: { member: MemberData }) => {
  const triggerRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <Dropdown
      title={member.profile.full_name || member.profile.email.split("@")[0]}
      isOpen={showDropdown}
      setIsOpen={setShowDropdown}
      triggerRef={triggerRef}
      Label={({ onClick }) => (
        <div
          className="relative group cursor-pointer"
          onClick={onClick}
          ref={triggerRef}
          title={member.profile.full_name || member.profile.email}
        >
          <Image
            src={member.profile.avatar_url || "/default_avatar.png"}
            alt="Avatar"
            width={24}
            height={24}
            className="rounded-md object-cover max-w-6 max-h-6"
          />
          <div className="absolute inset-0 bg-transparent group-hover:bg-white/30 transition rounded-lg"></div>
        </div>
      )}
      content={
        <div className="flex flex-col gap-4 p-4 py-2">
          <div className="flex items-center gap-3">
            <Image
              src={member.profile.avatar_url || "/default_avatar.png"}
              alt="Avatar"
              width={48}
              height={48}
              className="rounded-lg min-w-12 min-h-12 max-w-12 max-h-12 object-cover"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-sm">
                {member.profile.full_name || "Unknown User"}
              </span>
              <span className="text-xs text-text-500">
                {member.profile.email}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-text-500">Role</span>
              <span className="text-xs font-medium bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                {member.role}
              </span>
            </div>
            {member.profile.username && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-500">Username</span>
                <span className="text-xs font-medium">
                  @{member.profile.username}
                </span>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
};

export default ShareAvatar;
