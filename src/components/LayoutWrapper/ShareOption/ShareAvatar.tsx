import Dropdown from "@/components/ui/Dropdown";
import { ProjectMemberType } from "@/types/team";
import { ProfileType } from "@/types/user";
import Image from "next/image";
import React, { useRef, useState } from "react";

interface MemberData extends ProjectMemberType {
  profile: ProfileType;
}

const ShareAvatar = ({ member }: { member: MemberData }) => {
  const triggerRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <Dropdown
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
            width={20}
            height={20}
            className="rounded-full object-cover max-w-5 max-h-5"
          />
          <div className="absolute inset-0 bg-transparent group-hover:bg-white/30 transition rounded-full"></div>
        </div>
      )}
      items={[
        {
          id: 1,
          onClick: () => {},
          label: "Test",
        },
      ]}
    />
  );
};

export default ShareAvatar;
