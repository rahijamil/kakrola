import { v4 as uuid4 } from "uuid";

// Enum for all possible notification types
export enum NotificationTypeEnum {
  MENTION = "mention",
  ASSIGNMENT = "assignment",
  DUE_DATE = "due_date",
  COMMENT = "comment",
  PROJECT_UPDATE = "project_update",
  TEAM_UPDATE = "team_update",
}

// Enum for related entity types in notifications
export enum RelatedEntityTypeEnum {
  PROJECT = "project",
  SECTION = "section",
  TASK = "task",
  COMMENT = "comment",
  LABEL = "label",
  TEAM = "team",
  INVITE = "invite",
}

// Notification interface type
export interface NotificationType {
  id: string; // UUID for the notification
  recipient_id: string; // UUID of the user receiving the notification
  type: NotificationTypeEnum;
  content: string; // Text content of the notification
  related_entity_type: RelatedEntityTypeEnum;
  related_entity_id: number | string;
  is_read: boolean;
  created_at: string;
}

// Function to create a notification entry
export function createNotification(
  recipient_id: string,
  type: NotificationTypeEnum,
  content: string,
  related_entity_type: RelatedEntityTypeEnum,
  related_entity_id: number | string
): NotificationType {
  const notification: NotificationType = {
    id: uuid4(), // Generate a unique ID for the notification
    recipient_id,
    type,
    content,
    related_entity_type,
    related_entity_id,
    is_read: false, // New notifications are unread by default
    created_at: new Date().toISOString(),
  };

  // Here, you would save this to your database
  // For example: await supabase.from('notifications').insert(notification);

  return notification;
}

// Function to get notifications for a specific user
export async function getNotifications(
  recipient_id: string,
  page: number = 1,
  limit: number = 50
): Promise<NotificationType[]> {
  // Example query (replace with actual database logic):
  // const { data, error } = await supabase
  //   .from('notifications')
  //   .select('*')
  //   .eq('recipient_id', recipient_id)
  //   .order('created_at', { ascending: false })
  //   .range((page - 1) * limit, page * limit - 1);

  // if (error) throw error;
  // return data;

  // Placeholder return:
  return [];
}

// Example function to log a task assignment notification
export function logTaskAssignmentNotification(
  recipient_id: string,
  task_id: number | string,
  content: string
) {
  return createNotification(
    recipient_id,
    NotificationTypeEnum.ASSIGNMENT,
    content,
    RelatedEntityTypeEnum.TASK,
    task_id
  );
}
