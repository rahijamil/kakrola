import { PersonalMemberForProjectType, TeamMemberType } from "@/types/team";
import { DmContactType } from "@/types/channel";
import { supabaseBrowser } from "@/utils/supabase/client";

export const getDmContacts = async ({
  personalMembers,
  teamMembers,
  currentUserId,
}: {
  personalMembers: PersonalMemberForProjectType[];
  teamMembers: TeamMemberType[];
  currentUserId: string;
}): Promise<DmContactType[]> => {
  const { data: dmContacts, error } = await supabaseBrowser.rpc(
    "get_last_messages_for_profile",
    { _profile_id: currentUserId }
  );

  if (error) throw error;

  // Create a set of all member profile IDs
  const allMemberIds = new Set([
    ...personalMembers.map((m) => m.profile_id),
    ...teamMembers.map((m) => m.profile_id),
  ]);

  // Filter dmContacts to only include members from personalMembers and teamMembers
  const filteredContacts = (dmContacts as DmContactType[]).filter((contact) =>
    allMemberIds.has(contact.profile_id)
  );

  // Sort contacts by last message timestamp (most recent first)
  const sortedContacts = filteredContacts.sort((a, b) => {
    const timeA = a.last_message?.created_at ?? "0";
    const timeB = b.last_message?.created_at ?? "0";
    return timeB.localeCompare(timeA);
  });

  return sortedContacts;
};
