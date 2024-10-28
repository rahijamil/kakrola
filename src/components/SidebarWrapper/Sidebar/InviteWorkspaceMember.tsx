import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import InviteEmailInput from "@/components/LayoutWrapper/ShareOption/InviteEmailInput";
import { useAuthProvider } from "@/context/AuthContext";

const InviteWorkspaceMember = ({ onClose }: { onClose: () => void }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuthProvider();

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="space-y-4 [&>button]:hidden px-1 h-full md:max-h-[500px]">
        <InviteEmailInput
          emails={emails}
          setEmails={setEmails}
          error={error}
          setError={setError}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          workspaceId={profile?.metadata?.current_workspace_id}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InviteWorkspaceMember;
