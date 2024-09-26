import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useAuthProvider } from "@/context/AuthContext";
import { DmType, DmContactType } from "@/types/channel";
import { getDmContacts } from "./getDmContacts";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";

const getDms = async (
  contactId: string,
  profileId: string,
  limit: number = 20,
  offset: number = 0
): Promise<DmType[]> => {
  const { data, error } = await supabaseBrowser
    .from("dms")
    .select("*")
    .or(
      `sender_profile_id.eq.${contactId},recipient_profile_id.eq.${contactId}`
    )
    .or(
      `sender_profile_id.eq.${profileId},recipient_profile_id.eq.${profileId}`
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
};

const useDms = () => {
  const { profile } = useAuthProvider();
  const { personalMembers, teamMembers } = useSidebarDataProvider();
  const queryClient = useQueryClient();
  const [limit, setLimit] = useState(20);

  const { data: contacts = [], isLoading: isLoadingContacts } = useQuery<
    DmContactType[]
  >({
    queryKey: ["dmContacts", personalMembers, teamMembers, profile?.id],
    queryFn: () =>
      getDmContacts({
        personalMembers,
        teamMembers,
        currentUserId: profile?.id!,
      }),
    enabled: !!personalMembers && !!teamMembers && !!profile?.id,
    refetchOnWindowFocus: false,
  });

  const getDmsForContact = useCallback(
    (contactId: string) => {
      return queryClient.fetchQuery({
        queryKey: ["dms", profile?.id, contactId, limit],
        queryFn: () => getDms(contactId, profile?.id!, limit),
      });
    },
    [profile?.id, limit, queryClient]
  );

  const addNewDm = useCallback(
    async (newDm: DmType) => {
      try {
        // Attempt to cancel any ongoing queries for this specific DM conversation
        try {
          await queryClient.cancelQueries({
            queryKey: ["dms", profile?.id, newDm.recipient_profile_id],
          });
        } catch (cancelError: any) {
          // Ignore the CancelledError, as it's expected
          if (cancelError.name !== "CancelledError") {
            console.error("Error cancelling queries:", cancelError);
          }
        }

        // Get the current data from the cache
        const previousDms =
          queryClient.getQueryData<DmType[]>([
            "dms",
            profile?.id,
            newDm.recipient_profile_id,
          ]) || [];

        // Update the cache with the new DM
        queryClient.setQueryData(
          ["dms", profile?.id, newDm.recipient_profile_id],
          [...previousDms, newDm]
        );

        // Update the contacts list with the new last message
        queryClient.setQueryData<DmContactType[]>(
          ["dmContacts", personalMembers, teamMembers, profile?.id],
          (oldContacts) => {
            if (!oldContacts) return oldContacts;
            return oldContacts
              .map((contact) =>
                contact.profile_id === newDm.recipient_profile_id
                  ? { ...contact, last_message: newDm }
                  : contact
              )
              .sort((a, b) => {
                const timeA = a.last_message?.created_at ?? "0";
                const timeB = b.last_message?.created_at ?? "0";
                return timeB.localeCompare(timeA);
              });
          }
        );
      } catch (error) {
        console.error("Error adding new DM:", error);
      }
    },
    [profile?.id, queryClient, personalMembers, teamMembers]
  );

  const loadMore = useCallback(
    async (contactId: string): Promise<DmType[]> => {
      const previousDms =
        queryClient.getQueryData<DmType[]>(["dms", profile?.id, contactId]) ||
        [];
      const newDms = await getDms(
        contactId,
        profile?.id!,
        limit,
        previousDms.length
      );
      const updatedDms = [...previousDms, ...newDms];
      queryClient.setQueryData(["dms", profile?.id, contactId], updatedDms);
      return newDms;
    },
    [profile?.id, limit, queryClient]
  );

  return {
    contacts,
    isLoadingContacts,
    getDmsForContact,
    addNewDm,
    loadMore,
    limit,
    setLimit,
  };
};

export default useDms;
