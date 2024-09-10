import { supabaseBrowser } from "@/utils/supabase/client";

// Comprehensive enum for all possible actions across the app
export enum ActivityAction {
  // Project actions
  CREATED_PROJECT = "created_project",
  UPDATED_PROJECT = "updated_project",
  ARCHIVED_PROJECT = "archived_project",
  UNARCHIVED_PROJECT = "unarchived_project",
  DELETED_PROJECT = "deleted_project",
  LEAVED_PROJECT = "leaved_project",

  // Section actions
  CREATED_SECTION = "created_section",
  UPDATED_SECTION = "updated_section",
  ARCHIVED_SECTION = "archived_section",
  UNARCHIVED_SECTION = "unarchived_section",
  DELETED_SECTION = "deleted_section",
  REORDERED_SECTION = "reordered_section",

  // Task actions
  CREATED_TASK = "created_task",
  UPDATED_TASK = "updated_task",
  COMPLETED_TASK = "completed_task",
  REOPENED_TASK = "reopened_task",
  DELETED_TASK = "deleted_task",
  MOVED_TASK = "moved_task",
  ASSIGNED_TASK = "assigned_task",
  UNASSIGNED_TASK = "unassigned_task",
  REORDERED_TASK = "reordered_section",

  // Comment actions
  ADDED_COMMENT = "added_comment",
  UPDATED_COMMENT = "updated_comment",
  DELETED_COMMENT = "deleted_comment",

  // Label actions
  CREATED_LABEL = "created_label",
  UPDATED_LABEL = "updated_label",
  DELETED_LABEL = "deleted_label",

  // Team actions
  CREATED_TEAM = "created_team",
  UPDATED_TEAM = "updated_team",
  DELETED_TEAM = "deleted_team",

  // Invite actions
  SENT_INVITE = "sent_invite",
  ACCEPTED_INVITE = "accepted_invite",
  REJECTED_INVITE = "rejected_invite",
  CANCELED_INVITE = "canceled_invite",

  // Member actions
  ADDED_MEMBER = "added_member",
  UPDATED_MEMBER_ROLE = "updated_member_role",
  REMOVED_MEMBER = "removed_member",

  // User actions
  UPDATED_PROFILE = "updated_profile",
  CHANGED_PASSWORD = "changed_password",
  ENABLED_TWO_FACTOR = "enabled_two_factor",
  DISABLED_TWO_FACTOR = "disabled_two_factor",

  // Attachment actions
  UPLOADED_ATTACHMENT = "uploaded_attachment",
  DELETED_ATTACHMENT = "deleted_attachment",

  // View actions
  CHANGED_VIEW = "changed_view",
  UPDATED_VIEW_SETTINGS = "updated_view_settings",

  // Other actions
  LOGGED_IN = "logged_in",
  LOGGED_OUT = "logged_out",
}

// Enum for all possible entity types
export enum EntityType {
  PROJECT = "project",
  SECTION = "section",
  TASK = "task",
  COMMENT = "comment",
  LABEL = "label",
  TEAM = "team",
  INVITE = "invite",
  USER = "user",
  ATTACHMENT = "attachment",
  VIEW = "view",
}

// Refined ActivityLogType using the new enums
export interface ActivityLogType {
  id?: number | string;
  actor_id: string; // UUID of the user who performed the action
  action: ActivityAction;
  entity_type: EntityType;
  entity_id: number | string; // ID of the affected entity
  metadata: {
    old_data?: any;
    new_data?: any;
  }; // Additional context about the action
  created_at?: string;
}

// Function to create an activity log entry
export async function createActivityLog({
  actor_id,
  action,
  entity_type,
  entity_id,
  metadata,
}: {
  actor_id: string;
  action: ActivityAction;
  entity_type: EntityType;
  entity_id: number | string;
  metadata: ActivityLogType["metadata"];
}) {
  const activityLog: ActivityLogType = {
    actor_id,
    action,
    entity_type,
    entity_id,
    metadata,
  };
  try {
    const { data, error } = await supabaseBrowser
      .from("activity_logs")
      .insert(activityLog);

    if (error) throw error;
  } catch (error) {
    console.error(error);
  }
}

// Function to get activity logs for a specific entity
export async function getActivityLogs(
  actor_id: string,
  entity_type: EntityType,
  entity_id: number | string,
  page: number = 1,
  limit: number = 50
): Promise<ActivityLogType[]> {
  // Here, you would fetch from your database
  // For example:
  // const { data, error } = await supabase
  //   .from('activity_logs')
  //   .select('*')
  //   .eq('actor_id', actor_id)
  //   .eq('entity_type', entity_type)
  //   .eq('entity_id', entity_id)
  //   .order('created_at', { ascending: false })
  //   .range((page - 1) * limit, page * limit - 1);

  // if (error) throw error;
  // return data;

  // Placeholder return:
  return [];
}
