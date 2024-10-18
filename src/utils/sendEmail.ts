import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import { TeamType } from "@/types/team";
import { ProjectType } from "@/types/project";
import { PageType } from "@/types/pageTypes";
import { createClient } from "./supabase/server";
import {
  NotificationTypeEnum,
  RelatedEntityTypeEnum,
} from "@/types/notification";
import { createNotification } from "@/types/notification";

const emailTemplatesCache = new Map();

async function getEmailTemplate(
  templateName: "project-invite.html" | "team-invite.html"
) {
  if (emailTemplatesCache.has(templateName)) {
    return emailTemplatesCache.get(templateName);
  }

  const templatePath = path.join(
    process.cwd(),
    "public",
    "email-templates",
    templateName
  );
  const template = await fs.readFile(templatePath, "utf8");
  emailTemplatesCache.set(templateName, template);
  return template;
}

export async function sendBulkInviteEmails({
  invites,
  inviter,
  projectData,
  pageData,
  teamData,
}: {
  invites: {
    email: string;
    token: string;
  }[];
  inviter: {
    id: string;
    first_name: string;
    email: string;
    avatar_url: string;
  };
  projectData?: ProjectType;
  pageData?: PageType;
  teamData?: TeamType;
}) {
  const supabase = createClient();
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    pool: true,
    maxConnections: 5,
  });

  // Fetch templates once
  const [projectTemplate, teamTemplate] = await Promise.all([
    getEmailTemplate("project-invite.html"),
    getEmailTemplate("team-invite.html"),
  ]);

  // Fetch all recipient profiles in one query
  const { data: recipientProfiles } = await supabase
    .from("profiles")
    .select("id, email")
    .in(
      "email",
      invites.map((invite) => invite.email)
    );

  // Create a map for quick email to profile lookup
  const emailToProfileMap = new Map(
    recipientProfiles?.map((profile) => [profile.email, profile.id]) || []
  );

  // Prepare notification data
  const notificationData = {
    triggered_by: {
      id: inviter.id,
      first_name: inviter.first_name,
      avatar_url: inviter.avatar_url,
    },
    type: NotificationTypeEnum.INVITE,
    related_entity_type: projectData
      ? RelatedEntityTypeEnum.PROJECT
      : pageData
      ? RelatedEntityTypeEnum.PAGE
      : RelatedEntityTypeEnum.TEAM,
    data: {
      triggered_by: inviter.first_name,
      entityName: projectData?.name || pageData?.title || teamData?.name || "",
    },
  };

  // Prepare all email notifications in parallel
  const emailPromises = invites.map(async (invite) => {
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/invite/accept-invite?token=${invite.token}`;
    let template, subject, text;

    if (projectData || pageData) {
      template = projectTemplate
        .replaceAll("{{inviter_first_name}}", inviter.first_name)
        .replaceAll("{{inviter_email}}", inviter.email)
        .replaceAll("{{invite_link}}", inviteLink)
        .replaceAll("{{type}}", projectData ? "project" : "page");

      subject = `${inviter.first_name} added you to "${
        projectData ? projectData.name : pageData?.title
      }" in Kakrola!`;
      text = `Start collaborating on this project with ${inviter.first_name}. Please click the following link to accept your invitation: ${inviteLink}`;
    } else {
      template = teamTemplate
        .replaceAll("{{inviter_first_name}}", inviter.first_name)
        .replaceAll("{{inviter_email}}", inviter.email)
        .replaceAll("{{invite_link}}", inviteLink)
        .replaceAll("{{team_name}}", teamData?.name);

      subject = `${inviter.first_name} added you to "${teamData?.name}" in Kakrola!`;
      text = `Start collaborating on this team with ${inviter.first_name}. Please click the following link to accept your invitation: ${inviteLink}`;
    }

    const profileId = emailToProfileMap.get(invite.email);

    // If recipient exists, create notification
    if (profileId) {
      await createNotification({
        recipients: [
          {
            profile_id: profileId,
            is_read: false,
          },
        ],
        ...notificationData,
        redirect_url: projectData
          ? `/app/project/${projectData.slug}`
          : pageData
          ? `/app/page/${pageData.slug}`
          : `/app/${teamData?.id}`,
        api_url: inviteLink,
      });
    }

    return {
      from: `"${inviter.first_name} via Kakrola" <notifications@kakrola.com>`,
      to: invite.email,
      subject,
      text,
      html: template,
    };
  });

  // Send emails in batches of 5
  const emailBatches = chunk(await Promise.all(emailPromises), 5);
  for (const batch of emailBatches) {
    await Promise.all(batch.map((mail) => transporter.sendMail(mail)));
  }
}

// Utility function to chunk array
function chunk<T>(array: T[], size: number): T[][] {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
