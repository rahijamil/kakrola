// Activity Log types
export interface ActivityLogType {
  id: number;
  profile_id: string; // UUID of the user who performed the action
  action_type: ActivityActionType;
  entity_type: EntityType;
  entity_id: number | string; // ID of the affected entity (project, task, etc.)
  details: object; // JSON object with additional details
  created_at: Date;
}

enum ActivityActionType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  COMPLETE = "COMPLETE",
  ASSIGN = "ASSIGN",
  COMMENT = "COMMENT",
  // Add more action types as needed
}

export enum EntityType {
  TASK = "TASK",
  PROJECT = "PROJECT",
  SECTION = "SECTION",
  COMMENT = "COMMENT",
  TEAM = "TEAM",
  // Add more entity types as needed
}
