import InviteEmailInput from "@/components/LayoutWrapper/ShareOption/InviteEmailInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TeamType } from "@/types/team";
import React, { useState } from "react";

const InviteTeamspaceMembers = ({
  team,
  onClose,
}: {
  team: TeamType;
  onClose: () => void;
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="[&>button]:hidden px-1 gap-0">
        <div className="space-y-4">
          <DialogHeader className="px-4">
            <DialogTitle className="flex items-center gap-2 text-sm">
              <span>Invite people</span>
              <div className="flex items-center gap-1">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={team.avatar_url as string} />
                  <AvatarFallback>{team.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <span>{team.name}</span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <InviteEmailInput
            emails={emails}
            setEmails={setEmails}
            error={error}
            setError={setError}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            teamId={team.id}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteTeamspaceMembers;
