import { DmContactType, DmType } from "@/types/channel";
import { supabaseBrowser } from "@/utils/supabase/client";
import { PageType } from "@/types/pageTypes";
import { ProjectType } from "@/types/project";
import { ProfileType } from "@/types/user";
import { WorkspaceType } from "@/types/workspace";
import { WorkspaceWithMember } from "@/context/AuthContext";

export const getDmContacts = async ({
  pages,
  projects,
  profileId,
}: {
  pages: PageType[];
  projects: ProjectType[];
  workspacesWithMembers: WorkspaceWithMember[];
  profileId?: ProfileType["id"];
}): Promise<DmContactType[]> => {
  if (!profileId) return [];

  try {
    const pageIds = pages.map((page) => page.id);
    const projectIds = projects.map((project) => project.id);

    // Fetch members using the page IDs and project IDs
    const { data: members, error: membersError } = await supabaseBrowser
      .from("personal_members")
      .select(
        `
        profiles(
          id,
          avatar_url,
          full_name,
          email,
          dms_sent:dms!dms_sender_profile_id_fkey(*),
          dms_received:dms!dms_recipient_profile_id_fkey(*)
        )
      `
      )
      .or(
        `page_id.in.(${pageIds.join(",")}),project_id.in.(${projectIds.join(
          ","
        )})`
      );

    if (membersError) throw membersError;

    const membersWithLastDms: DmContactType[] = members.map((member) => {
      const profile = member.profiles as any;
      const otherProfileId = profile.id;

      // Combine sent and received DMs for the specific contact
      const allDms = [
        ...(profile.dms_sent || []).filter(
          (dm: DmType) =>
            (dm.sender_profile_id === profileId &&
              dm.recipient_profile_id === otherProfileId) ||
            (dm.recipient_profile_id === profileId &&
              dm.sender_profile_id === otherProfileId)
        ),
        ...(profile.dms_received || []).filter(
          (dm: DmType) =>
            (dm.sender_profile_id === profileId &&
              dm.recipient_profile_id === otherProfileId) ||
            (dm.recipient_profile_id === profileId &&
              dm.sender_profile_id === otherProfileId)
        ),
      ]
        .filter(
          (dm, index, self) =>
            dm.created_at && self.findIndex((m) => m.id === dm.id) === index // Ensure unique messages by id
        )
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ); // Sort by date (most recent first)

      const lastDms = allDms.slice(allDms.length - 1)[0] || null; // Get the most recent DM, or null if none exists

      return {
        profile_id: profile.id,
        name: profile.full_name || profile.email.split("@")[0],
        avatar_url: profile.avatar_url,
        last_message: lastDms,
        all_dms: allDms,
      };
    });

    // Use a map to ensure unique contacts by profile_id
    const uniqueContactsMap = new Map<string, DmContactType>();

    membersWithLastDms.forEach((contact) => {
      if (!uniqueContactsMap.has(contact.profile_id)) {
        uniqueContactsMap.set(contact.profile_id, contact);
      }
    });

    // Convert the map back to an array
    const uniqueContacts = Array.from(uniqueContactsMap.values());

    // Sort contacts by last message timestamp (most recent first)
    const sortedContacts = uniqueContacts.sort((a, b) => {
      const timeA = a.last_message?.created_at ?? "0";
      const timeB = b.last_message?.created_at ?? "0";
      return new Date(timeB).getTime() - new Date(timeA).getTime();
    });

    return sortedContacts;
  } catch (error) {
    console.error(`Error fetching members:`, error);
    return [];
  }
};
