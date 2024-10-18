import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/auth";
import { ProjectInviteType, PageInviteType } from "@/types/team";
import { ProfileType } from "@/types/user";
import { differenceInDays } from "date-fns";
import { PersonalRoleType, TeamRoleType } from "@/types/role";
import { updateSubscription } from "@/utils/paddle/update-subscription";
import { getSubscription } from "@/utils/paddle/get-subscription";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    console.error("Token is missing");
    return NextResponse.json({ error: "Token is missing" }, { status: 400 });
  }

  const supabase = createClient();

  // Fetch invite and user in parallel
  const [user, { data: invite, error: inviteError }] = await Promise.all([
    getUser(),
    supabase.from("invites").select("*").eq("token", token).single(),
  ]);

  if (inviteError || !invite) {
    console.error(
      "Invalid invite token:",
      inviteError?.message || "No invite found"
    );
    return NextResponse.json(
      { error: inviteError?.message || "Invalid invite token" },
      { status: 400 }
    );
  }

  // Quick validation checks
  const inviteAgeInDays = differenceInDays(
    new Date(),
    new Date(invite.created_at)
  );

  if (inviteAgeInDays > 7) {
    console.error("Invite has expired");
    return NextResponse.json({ error: "Invite has expired" }, { status: 400 });
  }

  // Handle existing user accepting their invite
  if (user && user?.email === invite.email) {
    try {
      await handleOptimizedInviteAcceptance(invite, user);
      return NextResponse.redirect(`${origin}/app`);
    } catch (error: any) {
      console.error("Error while accepting invite:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // Check if user needs to sign up or log in
  const { data: userProfile, error: userProfileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", invite.email)
    .single();

  console.log(
    "User profile fetch result:",
    userProfile,
    "Profile fetch error:",
    userProfileError
  );

  const redirectUrl = `${origin}/auth/${
    userProfile ? "login" : "signup"
  }?email=${invite.email}&token=${token}`;
  console.log("Redirecting user to:", redirectUrl);

  return NextResponse.redirect(redirectUrl);
}

async function handleOptimizedInviteAcceptance(
  invite: ProjectInviteType | PageInviteType,
  profile: ProfileType
) {
  const supabase = createClient();
  const id = invite.project_id || invite.page_id;
  const column_name = invite.project_id ? "project_id" : "page_id";

  try {
    const operations = [];

    // Handle personal member insertion
    if (id) {
      const { data: memberInfo } = await supabase
        .from("personal_members")
        .select("settings->order")
        .eq(column_name, id)
        .order("settings->order", { ascending: false })
        .limit(1);

      const newOrder = memberInfo?.[0]?.order
        ? Number(memberInfo[0].order) + 1
        : 1;

      const memberData = {
        [column_name]: id,
        profile_id: profile.id,
        role: invite.role as PersonalRoleType,
        settings: { is_favorite: false, order: newOrder },
      };

      operations.push(supabase.from("personal_members").insert(memberData));
    }

    // Handle team member insertion
    if (invite.team_id) {
      const { data: teamMember } = await supabase
        .from("team_members")
        .select("id")
        .eq("team_id", invite.team_id)
        .eq("profile_id", profile.id)
        .single();

      if (!teamMember) {
        const teamMemberData = {
          email: profile.email,
          team_id: invite.team_id,
          profile_id: profile.id,
          team_role: invite.role as TeamRoleType,
          settings: { projects: [], pages: [], channels: [] },
        };

        operations.push(supabase.from("team_members").insert(teamMemberData));

        // Check current subscription for proration
        const { data: currentSubscription } = await supabase
          .from("subscriptions")
          .select("subscription_id, price_id, seats")
          .eq("customer_profile_id", profile.id)
          .single();

        if (currentSubscription) {
          const currentSeatsCount = await supabase
            .from("team_members")
            .select("id")
            .eq("team_id", invite.team_id);

          const usedSeats = currentSeatsCount.data?.length || 0;
          const totalSeats = currentSubscription.seats || 0;

          // Only update subscription if no seats are available
          if (usedSeats >= totalSeats) {
            const newQuantity = totalSeats + 1; // Increment for the new member
            operations.push(
              updateSubscription(
                currentSubscription.subscription_id,
                currentSubscription.price_id,
                newQuantity
              )
            );
          }
        }
      }
    }

    // Delete the invite
    operations.push(supabase.from("invites").delete().eq("id", invite.id));

    // Execute all necessary operations in parallel
    await Promise.all(operations);

    console.log("Invite acceptance operations completed successfully.");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to accept invite:", error.message);
    throw new Error(`Failed to accept invite: ${error.message}`);
  }
}
