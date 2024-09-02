import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";

type InviteEmailParams = {
  to: string;
  token: string;
  inviter: { first_name: string; email: string };
  team_name: string;
};

export default async function sendInviteEmail({
  to,
  token,
  inviter,
  team_name,
}: InviteEmailParams) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/invite/accept-invite?token=${token}`;

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
      .replaceAll("{{team_name}}", team_name);

    // Email content
    const mailOptions = {
      from: `"${inviter.first_name} via Kakrola" <notifications@kakrola.com>`,
      to,
      subject: `${inviter.first_name} added you to "${team_name}" in Kakrola!`,
      text: `Start collaborating on this project with ${inviter.first_name}. Please click the following link to accept your invitation: ${inviteLink}`,
      html: emailTemplate,
    };

    await transporter.sendMail(mailOptions);
    console.log("Invite email sent successfully");
  } catch (error) {
    console.error("Failed to send invite email", error);
  }
}
