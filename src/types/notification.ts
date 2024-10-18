import { supabaseBrowser } from "@/utils/supabase/client";
import { ProfileType } from "./user";

// Enum for all possible notification types
export enum NotificationTypeEnum {
  INVITE = "invite",
  ASSIGNMENT = "assignment",
  MENTION = "mention",
  END_DATE = "end_date",
  COMMENT = "comment",
  PROJECT_UPDATE = "project_update",
  TEAM_UPDATE = "team_update",
}

// Enum for related entity types in notifications
export enum RelatedEntityTypeEnum {
  PAGE = "page",
  PROJECT = "project",
  SECTION = "section",
  TASK = "task",
  COMMENT = "comment",
  LABEL = "label",
  TEAM = "team",
}

// Notification templates for each type
const notificationTemplates = {
  [NotificationTypeEnum.INVITE]:
    "<b>{triggered_by}</b> invited you to the <b>{entityName}</b>",
  [NotificationTypeEnum.ASSIGNMENT]:
    "<b>{triggered_by}</b> assigned you to the task <b>{entityName}</b>",
  [NotificationTypeEnum.MENTION]:
    "<b>{triggered_by}</b> mentioned you in <b>{entityName}</b>",
  [NotificationTypeEnum.END_DATE]:
    "<b>{triggered_by}</b> set a new due date for the task <b>{entityName}</b>",
  [NotificationTypeEnum.COMMENT]:
    "<b>{triggered_by}</b> added a comment: <b>{entityName}</b>",
  [NotificationTypeEnum.PROJECT_UPDATE]:
    "<b>{triggered_by}</b> updated the project <b>{entityName}</b>",
  [NotificationTypeEnum.TEAM_UPDATE]:
    "<b>{triggered_by}</b> updated the team <b>{entityName}</b>",
};
interface Recipient {
  profile_id: ProfileType["id"];
  is_read: boolean;
}

// Notification interface
export interface NotificationType {
  id: string;
  created_at: string;
  recipients: Recipient[];
  triggered_by: {
    id: string;
    first_name: string;
    avatar_url: string;
  };
  content: string;
  type: NotificationTypeEnum;
  related_entity_type: RelatedEntityTypeEnum;
  redirect_url: string | null;
  api_url: string | null;
}

// Utility function to format notification content
function formatNotification(
  type: NotificationTypeEnum,
  data: Record<string, string>
): string {
  let template = notificationTemplates[type];
  if (!template) return ""; // Fallback if template doesn't exist

  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`{${key}}`, "g");
    template = template.replace(regex, data[key]);
  });

  return template;
}

export async function createNotification({
  recipients,
  triggered_by,
  type,
  related_entity_type,
  redirect_url,
  api_url,
  data, // Dynamic data to be used for formatting the content
}: {
  recipients: Recipient[];
  triggered_by: {
    id: string;
    first_name: string;
    avatar_url: string;
  };
  type: NotificationTypeEnum;
  related_entity_type: RelatedEntityTypeEnum;
  redirect_url: string | null;
  api_url: string | null;
  data: {
    triggered_by: string;
    entityName: string;
  }; // Dynamic data for content formatting
}): Promise<Omit<NotificationType, "id"> | null> {
  try {
    // Format the content based on the notification type and provided data
    const content = formatNotification(type, data);

    const newNotification: Omit<NotificationType, "id"> = {
      recipients,
      triggered_by,
      type,
      content, // The formatted content
      related_entity_type,
      redirect_url,
      api_url,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabaseBrowser
      .from("notifications")
      .insert(newNotification);

    if (error) {
      console.error(error);
      return null;
    }

    return newNotification;
  } catch (error) {
    console.error(error);
    return null;
  }
}
