import React, { useRef, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import Dropdown from "../ui/Dropdown";
import { UserPlus } from "lucide-react";
import { useAuthProvider } from "@/context/AuthContext";

const ShareOption = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useAuthProvider();

  const triggerRef = useRef(null);

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerRef={triggerRef}
      Label={({ onClick }) => (
        <div className="flex items-center gap-2">
          <div className="">
            <Image
              src={profile?.avatar_url || "/default_avatar.png"}
              alt="Avatar"
              width={24}
              height={24}
              className="rounded-full object-cover max-w-6 max-h-6"
            />
          </div>
          <button
            ref={triggerRef}
            className={`${
              isOpen ? "bg-text-100" : "hover:bg-text-100"
            } transition p-1 px-3 pr-2 rounded-full cursor-pointer flex items-center gap-1 text-text-500`}
            onClick={onClick}
          >
            <UserPlus strokeWidth={1.5} className="w-4 h-4" />
            <span className="hidden md:inline-block">Share</span>
          </button>
        </div>
      )}
      content={
        <div className="p-2">
          <Input
            placeholder="Add people by name or email"
            type="text"
            className="border border-text-200 focus:border-text-400 rounded-full px-2"
            howBig="sm"
          />
          <div className="flex flex-col items-center justify-center gap-6 py-7">
            <div className="w-52 h-52 flex items-center justify-center">
              <Image
                src="/images/collaboration.png"
                alt="Collaborate with friends and family"
                width={180}
                height={180}
              />
            </div>
            <div className="space-y-3">
              <div className="text-center space-y-1 text-text-700">
                <h3 className="text-base font-bold">
                  Collaborate with friends and family
                </h3>

                <div className="w-64">
                  <p className="">
                    Invite others to finally get on top of those household
                    chores or plan that dream holiday.
                  </p>
                </div>
              </div>

              <div className="mt-3 text-text-600 underline">
                <p>Or, add a team to Todoist instead</p>
              </div>
            </div>
          </div>
        </div>
      }
      contentWidthClass="w-[400px]"
    />
  );
};

export default ShareOption;
