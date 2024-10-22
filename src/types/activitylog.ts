import { supabaseBrowser } from "@/utils/supabase/client";
import { ProfileType } from "./user";

// Comprehensive enum for all possible actions across the app
export enum ActivityAction {
  // Page actions
  CREATED_PAGE = "created_page",
  UPDATED_PAGE = "updated_page",
  ARCHIVED_PAGE = "archived_page",
  UNARCHIVED_PAGE = "unarchived_page",
  DELETED_PAGE = "deleted_page",
  LEAVED_PAGE = "leaved_page",

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
  UPDATED_TASK_PRIORITY = "updated_task_priority",
  UPDATED_TASK_STATUS = "updated_task_status",
  ADDED_TASK_LABELS = "added_task_labels",
  REMOVED_TASK_LABELS = "removed_task_labels",
  UPDATED_TASK_DATES = "updated_task_dates",
  UPDATED_TASK_DESCRIPTION = "updated_task_description",

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
  PAGE = "page",
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
  actor_id: ProfileType["id"]; // UUID of the user who performed the action
  action: ActivityAction;
  entity: {
    type: EntityType; // Enum for entity types like PROJECT, TASK
    id: number | string; // Entity ID
    name: string; // Optional name of the entity (e.g., project name)
  };
  metadata?: {
    old_data?: any;
    new_data?: any;
  }; // Additional context about the action
  created_at?: string;
}

export interface ActivityWithProfile extends ActivityLogType {
  actor: {
    id: ProfileType["id"];
    avatar_url: ProfileType["avatar_url"];
    full_name: ProfileType["full_name"];
    email: ProfileType["email"];
  };
}

// Function to create an activity log entry
export async function createActivityLog({
  actor_id,
  action,
  entity,
  metadata,
}: Omit<ActivityLogType, 'id'>) {
  const activityLog: ActivityLogType = {
    actor_id,
    action,
    entity,
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

import { format, isToday, isYesterday } from "date-fns";

// Format the date for grouping
function formatDateGroup(date: string): string {
  const parsedDate = new Date(date);
  if (isToday(parsedDate)) return "Today";
  if (isYesterday(parsedDate)) return "Yesterday";
  return format(parsedDate, "MMMM d, yyyy");
}

// Group logs by day
function groupLogsByDate(
  logs: ActivityLogType[]
): Record<string, ActivityLogType[]> {
  return logs.reduce((acc, log) => {
    const dateKey = formatDateGroup(log.created_at!);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(log);
    return acc;
  }, {} as Record<string, ActivityLogType[]>);
}