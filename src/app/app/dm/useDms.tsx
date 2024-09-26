import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useAuthProvider } from "@/context/AuthContext";
import { DmType } from "@/types/channel";
import { useRef } from "react";
import { getDmContacts } from "./getDmContacts";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";

const getDms = async (
  contactId?: number | null,
  profileId?: string,
  limit: number = 20,
  offset: number = 0
): Promise<DmType[]> => {
  try {
    if (!contactId || !profileId) return [];

    const { data, error } = await supabaseBrowser
      .from("dms")
      .select("*")
      .eq("sender_profile_id", contactId)
      .eq("receiver_profile_id", profileId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const useDms = () => {
  const { profile } = useAuthProvider();
  const { personalMembers, teamMembers } = useSidebarDataProvider();
  const cache = useRef<{ [key: number]: DmType[] }>({});
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);

  const { data: dmMessages = {}, isLoading } = useQuery({
    queryKey: ["dms"],
    queryFn: async () => {
      const contacts = await getDmContacts({ personalMembers, teamMembers }); // fetch all contacts
      const promises = contacts.map((contact) =>
        getDms(contact.id, profile?.id, limit, offset)
      );
      const results = await Promise.all(promises);
      const preFetchedDms = results.reduce((acc, result, index) => {
        acc[contacts[index].id] = result;
        return acc;
      }, {} as { [key: number]: DmType[] });

      // cache the pre-fetched DMs
      Object.keys(preFetchedDms).forEach((contactId) => {
        cache.current[parseInt(contactId)] = preFetchedDms[parseInt(contactId)];
      });

      return preFetchedDms;
    },
    enabled: !!profile?.id,
    refetchOnWindowFocus: false,
    staleTime: 300000,
  });

  const getDmsForContact = (contactId: number): DmType[] => {
    if (cache.current[contactId]) {
      return cache.current[contactId];
    }

    return [];
  };

  const loadMore = async (contactId: number): Promise<DmType[]> => {
    if (!contactId || !profile?.id) return [];

    setOffset(offset + limit);
    const newDms = await getDms(contactId, profile?.id, limit, offset + limit);
    cache.current[contactId] = [...cache.current[contactId], ...newDms];
    return newDms;
  };

  return { getDmsForContact, isLoading, loadMore, limit, setLimit };
};

export default useDms;
