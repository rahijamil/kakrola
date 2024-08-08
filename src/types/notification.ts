import { EntityType } from "./activity_log";

// Notification types
export interface NotificationType {
    id: number;
    recipient_id: string; // UUID of the user receiving the notification
    sender_id: string | null; // UUID of the user who triggered the notification (if applicable)
    notification_type: NotificationActionType;
    entity_type: EntityType;
    entity_id: number | string;
    is_read: boolean;
    created_at: Date;
  }
  
  enum NotificationActionType {
    TASK_ASSIGNED = 'TASK_ASSIGNED',
    TASK_DUE_SOON = 'TASK_DUE_SOON',
    TASK_COMPLETED = 'TASK_COMPLETED',
    MENTIONED_IN_COMMENT = 'MENTIONED_IN_COMMENT',
    TEAM_INVITATION = 'TEAM_INVITATION',
    // Add more notification types as needed
  }