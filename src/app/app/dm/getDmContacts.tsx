import { getProfileById } from "@/lib/queries";
import { PersonalMemberType, TeamMemberType } from "@/types/team";

export const getDmContacts = async ({
  personalMembers,
  teamMembers,
}: {
  personalMembers: PersonalMemberType[];
  teamMembers: TeamMemberType[];
}): Promise<
  {
    id: number;
    profile_id: string;
    name: string;
    avatar_url: string;
  }[]
> => {
  const allMembers = [...personalMembers, ...teamMembers];

  const uniqueMembers = allMembers.filter(
    (member, index, self) =>
      index === self.findIndex((t) => t.profile_id === member.profile_id)
  );

  const contacts = await Promise.all(
    uniqueMembers.map(async (member) => {
      const memberProfile = await getProfileById(member.profile_id);
      return {
        id: member.id,
        profile_id: member.profile_id,
        name: memberProfile?.full_name,
        avatar_url: memberProfile.avatar_url,
      };
    })
  );

  const uniqueContacts = contacts.filter(
    (contact, index, self) =>
      index === self.findIndex((t) => t.profile_id === contact.profile_id)
  );

  return uniqueContacts;
};
  