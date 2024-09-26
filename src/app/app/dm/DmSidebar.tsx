"use client";

import { ScrollArea } from "@/components/ui/ScrollArea";
import Image from "next/image";
import React from "react";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
import useScreen from "@/hooks/useScreen";
import { DmContactType, DmType } from "@/types/channel";

interface DmSidebarProps {
  activeContact: DmContactType | null;
  setActiveContact: (contact: DmContactType | null) => void;
  dmContacts: DmContactType[];
  isLoadingContacts: boolean;
}

const DmSidebar: React.FC<DmSidebarProps> = ({
  activeContact,
  setActiveContact,
  dmContacts,
  isLoadingContacts,
}) => {
  const { screenWidth } = useScreen();

  const { sidebarLoading } = useSidebarDataProvider();

  const getLastMessagePreview = (message: string | undefined) => {
    if (!message) return "";
    try {
      const content = JSON.parse(message);
      return content.content[0].content[0].text || "";
    } catch (error) {
      console.error("Error parsing message content:", error);
      return "";
    }
  };

  return (
    <div
      className={`flex-1 md:flex-none md:w-1/4 max-w-[400px] md:border-r border-text-100 shadow-[inset_-1rem_0_1rem_-1rem_rgba(0,0,0,0.1),inset_1rem_0_1rem_-1rem_rgba(0,0,0,0.1)] ${
        screenWidth < 768 && activeContact ? "hidden" : ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-text-100 p-4 h-[53px]">
        <h2 className="font-semibold">Direct Messages</h2>
      </div>

      {screenWidth <= 768 && (
        <>
          {sidebarLoading || isLoadingContacts ? (
            <div className="py-2 px-4 border-b border-text-100 overflow-x-auto scrollbar-hide space-x-2">
              <div className="flex items-center justify-center gap-2">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <Skeleton className="w-10 h-10 rounded-lg" />
                <Skeleton className="w-10 h-10 rounded-lg" />
              </div>
            </div>
          ) : (
            dmContacts.length > 0 && (
              <div className="py-2 px-4 border-b border-text-100 overflow-x-auto scrollbar-hide space-x-2">
                {dmContacts.map((contact) => (
                  <button
                    onTouchStart={(ev) =>
                      ev.currentTarget.classList.add("bg-primary-10")
                    }
                    onTouchEnd={(ev) =>
                      ev.currentTarget.classList.remove("bg-primary-10")
                    }
                    onClick={() => {
                      setActiveContact(contact);
                      screenWidth <= 768 &&
                        window.history.pushState(
                          null,
                          "",
                          `/app/dm?contact-id=${contact.profile_id}`
                        );
                    }}
                    key={contact.profile_id}
                    className="flex flex-col items-center justify-center gap-1 transition p-2 pb-1 rounded-lg"
                  >
                    <Image
                      src={contact.avatar_url}
                      alt={contact.name}
                      className="w-12 h-12 min-w-12 min-h-12 rounded-lg object-cover"
                      width={48}
                      height={48}
                      onContextMenu={(ev) => ev.preventDefault()}
                    />

                    <span className="font-medium">{contact.name}</span>
                  </button>
                ))}
              </div>
            )
          )}
        </>
      )}

      <div className="h-[calc(100vh-5rem)] overflow-y-auto">
        {sidebarLoading || isLoadingContacts
          ? Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex items-center p-4 gap-3">
                <div className="w-9 h-9 min-w-9 min-h-9 rounded-lg object-cover">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="flex-1">
                  <Skeleton className="w-full h-4" />
                </div>
              </div>
            ))
          : dmContacts.map((contact) => {
              const lastMessage = contact.last_message;

              return (
                <button
                  key={contact.profile_id}
                  onClick={() => {
                    setActiveContact(contact);
                    screenWidth <= 768 &&
                      window.history.pushState(
                        null,
                        "",
                        `/app/dm?contact-id=${contact.profile_id}`
                      );
                  }}
                  onTouchStart={(ev) =>
                    ev.currentTarget.classList.add("bg-primary-10")
                  }
                  onTouchEnd={(ev) =>
                    ev.currentTarget.classList.remove("bg-primary-10")
                  }
                  className={`flex items-center p-4 cursor-pointer border-r-4 transition text-left w-full ${
                    activeContact?.profile_id === contact.profile_id
                      ? "bg-primary-50 border-primary-200"
                      : "md:hover:bg-primary-10 border-transparent"
                  }`}
                >
                  <Image
                    src={contact.avatar_url}
                    alt={contact.name}
                    className="w-9 h-9 min-w-9 min-h-9 rounded-lg mr-3 object-cover"
                    width={36}
                    height={36}
                    onContextMenu={(ev) =>
                      screenWidth <= 768 ? ev.preventDefault() : null
                    }
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-medium truncate">{contact.name}</h3>
                      <span className="text-xs text-text-500 whitespace-nowrap">
                        {lastMessage &&
                          moment(lastMessage.created_at).fromNow()}
                      </span>
                    </div>
                    <p className="text-text-500 text-xs truncate">
                      {getLastMessagePreview(lastMessage?.content)}
                    </p>
                  </div>
                </button>
              );
            })}
      </div>
    </div>
  );
};

export default DmSidebar;
