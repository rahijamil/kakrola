import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthProvider } from "@/context/AuthContext";
import { DmContactType, DmType } from "@/types/channel";
import { getDmContacts } from "./getDmContacts";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import { supabaseBrowser } from "@/utils/supabase/client";

const useDms = () => {
  const { profile } = useAuthProvider();
  const { pages, projects } = useSidebarDataProvider();
  const queryClient = useQueryClient();

  const [activeContact, setActiveContact] = useState<DmContactType | null>(
    null
  );
  const [dmMessages, setDmMessages] = useState<DmType[]>([]);

  const { data: contacts = [], isLoading: isLoadingContacts } = useQuery<
    DmContactType[]
  >({
    queryKey: ["dmContacts", profile?.id],
    queryFn: () =>
      getDmContacts({
        pages,
        projects,
        profileId: profile?.id,
      }),
    enabled: (pages.length > 0 || projects.length > 0) && !!profile?.id,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 15,
  });

  // Update dmMessages when activeContact or contacts change
  useEffect(() => {
    if (activeContact) {
      const activeContactMessages =
        contacts.find(
          (contact) => contact.profile_id === activeContact.profile_id
        )?.all_dms || [];

      setDmMessages(activeContactMessages);
    }
  }, [contacts, activeContact]);

  // Subscribe to realtime updates for DMs
  useEffect(() => {
    if (!profile?.id) return;

    const filter = `recipient_profile_id=eq.${profile.id}`;

    const channel = supabaseBrowser
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all changes
          schema: "public",
          table: "dms",
          filter, // Filter for messages received by the current user
        },
        (payload) => {
          const newMessage = payload.new as DmType;
          const oldMessage = payload.old as DmType;

          contacts.map((contact) => {
            // If the contact is active, update the dmMessages state
            if (contact.profile_id === activeContact?.profile_id) {
              setDmMessages((prevMessages) => {
                switch (payload.eventType) {
                  case "INSERT":
                    if (!prevMessages.some((msg) => msg.id === newMessage.id)) {
                      return [...prevMessages, newMessage];
                    }
                    return prevMessages; // No update if the message already exists

                  case "UPDATE":
                    return prevMessages.map((msg) =>
                      msg.id === oldMessage.id ? newMessage : msg
                    );

                  case "DELETE":
                    return prevMessages.filter(
                      (msg) => msg.id !== oldMessage.id
                    );

                  default:
                    return prevMessages; // Always return the previous state by default
                }
              });
            }
          });

          queryClient.setQueryData(
            ["dmContacts", profile?.id],
            (prevContacts: DmContactType[] = []) => {
              // Create a new copy of contacts with updated DMs
              const updatedContacts = prevContacts.map((contact) => {
                // Check if the message belongs to this contact
                if (contact.profile_id === newMessage.sender_profile_id) {
                  // Create a new copy of the contact with immutably updated all_dms
                  const updatedContact = {
                    ...contact,
                    all_dms: (() => {
                      switch (payload.eventType) {
                        case "INSERT":
                          // Add the new message if it doesn't already exist
                          if (
                            !contact.all_dms.some(
                              (dm) => dm.id === newMessage.id
                            )
                          ) {
                            return [...contact.all_dms, newMessage];
                          }
                          return contact.all_dms;

                        case "UPDATE":
                          // Update the specific message in the all_dms array
                          return contact.all_dms.map((dm) =>
                            dm.id === oldMessage.id ? newMessage : dm
                          );

                        case "DELETE":
                          // Remove the message from the all_dms array
                          return contact.all_dms.filter(
                            (dm) => dm.id !== oldMessage.id
                          );

                        default:
                          return contact.all_dms;
                      }
                    })(),
                    last_message: (() => {
                      switch (payload.eventType) {
                        case "DELETE":
                          return (
                            contact.all_dms[contact.all_dms.length - 1] || null
                          );
                        default:
                          return newMessage;
                      }
                    })(),
                  };

                  return updatedContact;
                }
                return contact; // Return the unchanged contact
              });

              return updatedContacts; // Return a new array with updated contacts
            }
          );
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [profile?.id, queryClient, activeContact]);

  return {
    contacts,
    isLoadingContacts,
    activeContact,
    setActiveContact,
    dmMessages,
    setDmMessages,
  };
};

export default useDms;
