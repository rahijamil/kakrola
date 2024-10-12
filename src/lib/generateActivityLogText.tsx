import { ActivityAction, ActivityWithProfile } from "@/types/activitylog";
import { ActivityLogType } from "@/types/activitylog";
import { TaskAssigneeType, TaskLabelType, TaskPriority } from "@/types/project";
import { ProfileType } from "@/types/user";
import { colors } from "@/utils/colors";
import { format } from "date-fns";
import Image from "next/image";
import { Theme } from "./theme.types";
import { ReactNode } from "react";
import { PriorityIcon } from "@/utils/utility_functions";

export function generateActivityLogText(
  log: ActivityWithProfile,
  forGlobal?: boolean
): ReactNode {
  const actorName = (
    <span className="font-bold text-text-900">{log.actor.full_name}</span>
  );
  const entityName = log.entity?.name && (
    <span className="font-bold text-text-900">"{log.entity.name}"</span>
  );

  const WrapWithSpan = ({ children }: { children: ReactNode }) => (
    <span className="font-bold text-text-900">{children}</span>
  );

  switch (log.action) {
    // Page actions
    case ActivityAction.CREATED_PAGE:
      return (
        <p className="">
          {actorName} created the page {entityName}.
        </p>
      );
    case ActivityAction.UPDATED_PAGE:
      return (
        <p className="">
          {actorName} updated the page {entityName}.
        </p>
      );
    case ActivityAction.ARCHIVED_PAGE:
      return (
        <p className="">
          {actorName} archived the page {entityName}.
        </p>
      );
    case ActivityAction.UNARCHIVED_PAGE:
      return (
        <p className="">
          {actorName} unarchived the page {entityName}.
        </p>
      );
    case ActivityAction.DELETED_PAGE:
      return (
        <p className="">
          {actorName} deleted the page {entityName}.
        </p>
      );
    case ActivityAction.LEAVED_PAGE:
      return (
        <p className="">
          {actorName} left the page {entityName}.
        </p>
      );

    // Project actions
    case ActivityAction.CREATED_PROJECT:
      return (
        <p className="">
          {actorName} created the project {entityName}.
        </p>
      );
    case ActivityAction.UPDATED_PROJECT:
      return (
        <p className="">
          {actorName} updated the project {entityName}.
        </p>
      );
    case ActivityAction.ARCHIVED_PROJECT:
      return (
        <p className="">
          {actorName} archived the project {entityName}.
        </p>
      );
    case ActivityAction.UNARCHIVED_PROJECT:
      return (
        <p className="">
          {actorName} unarchived the project {entityName}.
        </p>
      );
    case ActivityAction.DELETED_PROJECT:
      return (
        <p className="">
          {actorName} deleted the project {entityName}.
        </p>
      );
    case ActivityAction.LEAVED_PROJECT:
      return (
        <p className="">
          {actorName} left the project {entityName}.
        </p>
      );

    // Section actions
    case ActivityAction.CREATED_SECTION:
      return (
        <p className="">
          {actorName} created the section {entityName}.
        </p>
      );
    case ActivityAction.UPDATED_SECTION:
      return (
        <p className="">
          {actorName} updated the section {entityName}.
        </p>
      );
    case ActivityAction.ARCHIVED_SECTION:
      return (
        <p className="">
          {actorName} archived the section {entityName}.
        </p>
      );
    case ActivityAction.UNARCHIVED_SECTION:
      return (
        <p className="">
          {actorName} unarchived the section {entityName}.
        </p>
      );
    case ActivityAction.DELETED_SECTION:
      return (
        <p className="">
          {actorName} deleted the section {entityName}.
        </p>
      );
    case ActivityAction.REORDERED_SECTION:
      return <p className="">{actorName} reordered the sections.</p>;

    // Task actions
    case ActivityAction.CREATED_TASK:
      return (
        <p className="">
          {actorName} created a{" "}
          <span className="font-bold text-text-900">task</span>.
        </p>
      );
    case ActivityAction.UPDATED_TASK:
      return (
        <p className="">
          {actorName} updated the{" "}
          <span className="font-bold text-text-900">task</span>.
        </p>
      );
    case ActivityAction.COMPLETED_TASK:
      return (
        <p className="">
          {actorName} completed the{" "}
          <span className="font-bold text-text-900">task</span>.
        </p>
      );
    case ActivityAction.REOPENED_TASK:
      return (
        <p className="">
          {actorName} reopened the{" "}
          <span className="font-bold text-text-900">task</span>.
        </p>
      );
    case ActivityAction.DELETED_TASK:
      return (
        <p className="">
          {actorName} deleted the task {entityName}.
        </p>
      );
    case ActivityAction.MOVED_TASK:
      return (
        <p className="">
          {actorName} moved the task {entityName} to another section.
        </p>
      );
    case ActivityAction.ASSIGNED_TASK:
      const addedAssignees: TaskAssigneeType[] =
        log.metadata?.new_data.assignees || [];
      // only show the last added one
      const assignees = addedAssignees
        .slice(addedAssignees.length - 1)
        .map((assignee) => (
          <div
            key={assignee.id}
            className="flex items-center gap-1 bg-text-200 rounded-lg px-1 font-medium"
          >
            <Image
              src={assignee.avatar_url || "/default_avatar.png"}
              width={18}
              height={18}
              alt={assignee.name || "avatar"}
              className="rounded-md object-cover max-w-[18px] max-h-[18px]"
            />
            {assignee.name}
          </div>
        ));

      return (
        <p className="flex gap-1">
          {actorName} added assignee{" "}
          <div className="flex items-center gap-1">{assignees}</div> to the{" "}
          <span className="font-bold text-text-900">task</span>.
        </p>
      );

    case ActivityAction.UNASSIGNED_TASK:
      const removedAssignees: TaskAssigneeType[] =
        log.metadata?.new_data.assignees || [];
      // only show the last added one
      const assigneeProfiles = removedAssignees
        .slice(removedAssignees.length - 1)
        .map((assignee) => (
          <div
            key={assignee.id}
            className="flex items-center gap-1 bg-text-200 rounded-lg px-1 font-medium"
          >
            <Image
              src={assignee.avatar_url || "/default_avatar.png"}
              width={18}
              height={18}
              alt={assignee.name || "avatar"}
              className="rounded-md object-cover max-w-[18px] max-h-[18px]"
            />
            {assignee.name}
          </div>
        ));

      return (
        <p className="flex gap-1">
          {actorName} removed assignee{" "}
          <div className="flex items-center gap-1">{assigneeProfiles}</div> to
          the <span className="font-bold text-text-900">task</span>.
        </p>
      );
    case ActivityAction.REORDERED_TASK:
      return <p className="">{actorName} reordered the tasks.</p>;
    case ActivityAction.UPDATED_TASK_PRIORITY:
      const priority: TaskPriority = log.metadata?.new_data.priority;

      const prioritySpan = (
        <div className="flex items-center gap-1 text-xs rounded-lg transition bg-text-200 px-1 font-medium">
          <PriorityIcon priority={priority} />
          <span className="text-xs">
            {priority == "Priority" ? "P4" : priority}
          </span>
        </div>
      );

      return (
        <div className="flex gap-1">
          {actorName} updated the priority {prioritySpan} of the task.
        </div>
      );
    case ActivityAction.ADDED_TASK_LABELS:
      const addedLabels: TaskLabelType[] =
        log.metadata?.new_data.task_labels || [];
      // only show the last added one
      const labels = addedLabels.slice(addedLabels.length - 1).map((label) => (
        <div
          key={label.id}
          style={{
            backgroundColor:
              colors.find((c) => c.value == label.color)?.color + "80",
          }}
          className="px-1 rounded-md font-medium text-text-900"
        >
          {label.name}
        </div>
      ));

      return (
        <p className="flex gap-1">
          {actorName} added label{" "}
          <div className="flex items-center gap-1">{labels}</div> to the{" "}
          <span className="font-bold text-text-900">task</span>.
        </p>
      );

    case ActivityAction.REMOVED_TASK_LABELS:
      const removedLabels: TaskLabelType[] =
        log.metadata?.new_data.assignees || [];
      // only show the last added one
      const labelSpans = removedLabels
        .slice(removedLabels.length - 1)
        .map((label) => (
          <div
            key={label.id}
            style={{
              backgroundColor:
                colors.find((c) => c.value == label.color)?.color + "80",
            }}
            className="px-1 rounded-md font-medium text-text-900"
          >
            {label.name}
          </div>
        ));

      return (
        <p className="flex gap-1">
          {actorName} removed label{" "}
          <div className="flex items-center gap-1">{labelSpans}</div> to the{" "}
          <span className="font-bold text-text-900">task</span>.
        </p>
      );

    case ActivityAction.UPDATED_TASK_DATES:
      return forGlobal ? (
        <p className="">
          {actorName} updated the end date to{" "}
          {format(log.metadata?.new_data.dates.end_date, "dd LLL")} of the task{" "}
          {entityName}.
        </p>
      ) : (
        <p className="">
          {actorName} updated this task end date to{" "}
          <WrapWithSpan>
            {format(log.metadata?.new_data.dates.end_date, "dd LLL")}
          </WrapWithSpan>
          .
        </p>
      );
    case ActivityAction.UPDATED_TASK_DESCRIPTION:
      return (
        <p className="">
          {actorName} updated the description of the task {entityName}.
        </p>
      );

    // Comment actions
    case ActivityAction.ADDED_COMMENT:
      return (
        <p className="">
          {actorName} added a comment to the task {entityName}.
        </p>
      );
    case ActivityAction.UPDATED_COMMENT:
      return (
        <p className="">
          {actorName} updated a comment on the task {entityName}.
        </p>
      );
    case ActivityAction.DELETED_COMMENT:
      return (
        <p className="">
          {actorName} deleted a comment on the task {entityName}.
        </p>
      );

    // Label actions
    case ActivityAction.CREATED_LABEL:
      return (
        <p className="">
          {actorName} created the label {entityName}.
        </p>
      );
    case ActivityAction.UPDATED_LABEL:
      return (
        <p className="">
          {actorName} updated the label {entityName}.
        </p>
      );
    case ActivityAction.DELETED_LABEL:
      return (
        <p className="">
          {actorName} deleted the label {entityName}.
        </p>
      );

    // Team actions
    case ActivityAction.CREATED_TEAM:
      return (
        <p className="">
          {actorName} created the team {entityName}.
        </p>
      );
    case ActivityAction.UPDATED_TEAM:
      return (
        <p className="">
          {actorName} updated the team {entityName}.
        </p>
      );
    case ActivityAction.DELETED_TEAM:
      return (
        <p className="">
          {actorName} deleted the team {entityName}.
        </p>
      );

    // Invite actions
    case ActivityAction.SENT_INVITE:
      return (
        <p className="">
          {actorName} sent an invite to {entityName}.
        </p>
      );
    case ActivityAction.ACCEPTED_INVITE:
      return (
        <p className="">
          {actorName} accepted an invite to {entityName}.
        </p>
      );
    case ActivityAction.REJECTED_INVITE:
      return (
        <p className="">
          {actorName} rejected an invite to {entityName}.
        </p>
      );
    case ActivityAction.CANCELED_INVITE:
      return (
        <p className="">
          {actorName} canceled the invite to {entityName}.
        </p>
      );

    // Member actions
    case ActivityAction.ADDED_MEMBER:
      return (
        <p className="">
          {actorName} added a new member to {entityName}.
        </p>
      );
    case ActivityAction.UPDATED_MEMBER_ROLE:
      return (
        <p className="">
          {actorName} updated the role of a member in {entityName}.
        </p>
      );
    case ActivityAction.REMOVED_MEMBER:
      return (
        <p className="">
          {actorName} removed a member from {entityName}.
        </p>
      );

    // User actions
    case ActivityAction.UPDATED_PROFILE:
      return <p className="">{actorName} updated their profile.</p>;
    case ActivityAction.CHANGED_PASSWORD:
      return <p className="">{actorName} changed their password.</p>;
    case ActivityAction.ENABLED_TWO_FACTOR:
      return <p className="">{actorName} enabled two-factor authentication.</p>;
    case ActivityAction.DISABLED_TWO_FACTOR:
      return (
        <p className="">{actorName} disabled two-factor authentication.</p>
      );

    default:
      return <p className="">{actorName} performed an action.</p>;
  }
}
