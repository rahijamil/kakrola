import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import { ProjectType } from "@/types/project";
import { TeamType } from "@/types/team";
import { createClient } from "./supabase/server";
import {
  NotificationTypeEnum,
  RelatedEntityTypeEnum,
} from "@/types/notification";
import { createNotification } from "@/types/notification";

type InviteEmailParams = {
  to: string;
  token: string;
  inviter: {
    id: string;
    first_name: string;
    email: string;
    avatar_url: string;
  };
  project_data: {
    id: number;
    name: string;
    slug: string;
  } | null;
  team_data: TeamType | null;
};

export default async function sendInviteEmail({
  to,
  token,
  inviter,
  project_data,
  team_data,
}: InviteEmailParams) {
  const supabase = createClient();

  try {
    const { data: recipientExistData, error: recipientError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", to)
      .single();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/invite/accept-invite?token=${token}`;

    if (project_data?.id) {
      const templatePath = path.join(
        process.cwd(),
        "public",
        "email-templates",
        "project-invite.html"
      );

      // Read the template using fs.promises
      let emailTemplate = await fs.readFile(templatePath, "utf8");

      // Replace placeholders with actual data
      emailTemplate = emailTemplate
        .replaceAll("{{inviter_first_name}}", inviter.first_name)
        .replaceAll("{{inviter_email}}", inviter.email)
        .replaceAll("{{invite_link}}", inviteLink);

      // Email content
      const mailOptions = {
        from: `"${inviter.first_name} via Kakrola" <notifications@kakrola.com>`,
        to,
        subject: `${inviter.first_name} added you to "${project_data.name}" in Kakrola!`,
        text: `Start collaborating on this project with ${inviter.first_name}. Please click the following link to accept your invitation: ${inviteLink}`,
        html: emailTemplate,
      };

      await transporter.sendMail(mailOptions);
      console.log("Invite email sent successfully");

      if (recipientExistData) {
        // Create a notification
        await createNotification({
          recipients: [recipientExistData.id],
          triggered_by: {
            id: inviter.id,
            first_name: inviter.first_name,
            avatar_url: inviter.avatar_url,
          },
          type: NotificationTypeEnum.INVITE,
          related_entity_type: RelatedEntityTypeEnum.PROJECT,
          redirect_url: `/app/project/${project_data.slug}`,
          api_url: inviteLink,
          data: {
            inviter: inviter.first_name,
            entityName: project_data.name,
          },
        });
      }
    } else if (team_data?.id) {
      const templatePath = path.join(
        process.cwd(),
        "public",
        "email-templates",
        "team-invite.html"
      );

      // Read the template using fs.promises
      let emailTemplate = await fs.readFile(templatePath, "utf8");

      // Replace placeholders with actual data
      emailTemplate = emailTemplate
        .replaceAll("{{inviter_first_name}}", inviter.first_name)
        .replaceAll("{{inviter_email}}", inviter.email)
        .replaceAll("{{invite_link}}", inviteLink)
        .replaceAll("{{team_name}}", team_data.name);

      // Email content
      const mailOptions = {
        from: `"${inviter.first_name} via Kakrola" <notifications@kakrola.com>`,
        to,
        subject: `${inviter.first_name} added you to "${team_data.name}" in Kakrola!`,
        text: `Start collaborating on this project with ${inviter.first_name}. Please click the following link to accept your invitation: ${inviteLink}`,
        html: emailTemplate,
      };

      await transporter.sendMail(mailOptions);
      console.log("Invite email sent successfully");

      if (recipientExistData) {
        // Create a notification
        await createNotification({
          recipients: [recipientExistData.id],
          triggered_by: {
            id: inviter.id,
            first_name: inviter.first_name,
            avatar_url: inviter.avatar_url,
          },
          type: NotificationTypeEnum.INVITE,
          related_entity_type: RelatedEntityTypeEnum.TEAM,
          redirect_url: `/app/${team_data.id}`,
          api_url: inviteLink,
          data: {
            inviter: inviter.first_name,
            entityName: team_data.name,
          },
        });
      }
    }
  } catch (error) {
    console.error("Failed to send invite email", error);
  }
}
