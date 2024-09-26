"use client";

import { ScrollArea } from "@/components/ui/ScrollArea";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getDmContacts } from "./getDmContacts";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/navigation";
import moment from "moment";
import useScreen from "@/hooks/useScreen";

const DmSidebar = ({
  activeContact,
  setActiveContact,
}: {
  activeContact: {
    id: number;
    profile_id: string;
    name: string;
    avatar_url: string;
  } | null;
  setActiveContact: (contact: {
    id: number;
    profile_id: string;
    name: string;
    avatar_url: string;
  }) => void;
}) => {
  const { personalMembers, teamMembers, sidebarLoading } =
    useSidebarDataProvider();
  const [dmContacts, setDmContacts] = useState<
    {
      id: number;
      profile_id: string;
      name: string;
      avatar_url: string;
    }[]
  >([]);

  const { screenWidth } = useScreen();
  useEffect(() => {
    const fetchDmContacts = async () => {
      const contacts = await getDmContacts({
        personalMembers,
        teamMembers,
      });
      setDmContacts(contacts);
    };

    fetchDmContacts();
  }, [personalMembers, teamMembers]);

  return (
    <div
      className={`flex-1 md:flex-none md:w-1/4 md:border-r border-text-100 ${
        screenWidth < 768 && activeContact ? "hidden" : ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-text-100 p-4 h-[53px]">
        <h2 className="font-semibold">Direct Messages</h2>
      </div>

      {screenWidth <= 768 && (
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
                    `/app/dm?contact-id=${contact.id}`
                  );
              }}
              key={contact.id}
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
      )}

      <ScrollArea className="h-[calc(100vh-5rem)]">
        {sidebarLoading
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
          : dmContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => {
                  setActiveContact(contact);
                  screenWidth <= 768 &&
                    window.history.pushState(
                      null,
                      "",
                      `/app/dm?contact-id=${contact.id}`
                    );
                }}
                onTouchStart={(ev) =>
                  ev.currentTarget.classList.add("bg-primary-10")
                }
                onTouchEnd={(ev) =>
                  ev.currentTarget.classList.remove("bg-primary-10")
                }
                className={`flex items-center p-4 cursor-pointer border-r-4 transition text-left ${
                  activeContact?.id === contact.id
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
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-medium">{contact.name}</h3>
                    <span className="text-xs text-text-500">
                      {moment(new Date()).fromNow()}
                    </span>
                  </div>
                  <p className="text-text-500 text-xs line-clamp-1">
                    {/* {contact.lastMessage} */}
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam, quos.
                  </p>
                </div>
              </button>
            ))}
      </ScrollArea>
    </div>
  );
};

export default DmSidebar;
