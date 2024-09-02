import React, { useState } from "react";
import axios from "axios";
import { TeamType } from "@/types/team";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";

const InviteLink = ({ team_id }: { team_id: TeamType["id"] }) => {
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCopyInviteLink = async () => {
    setLoading(true);
    setError(null);

    try {
      // Request the server to generate an invite link
      const response = await axios.post("/api/invite/generate-invite-link", {
        team_id,
      });

      if (response.data.success) {
        const { link } = response.data;
        setInviteLink(link);
        navigator.clipboard.writeText(link); // Copy the link to clipboard
        alert("Invite link copied to clipboard!");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleCopyInviteLink}
        disabled={loading}
        fullWidth
        variant="gray"
      >
        {loading ? <Spinner /> : "Copy Invite Link"}
      </Button>

      {error && <p>{error}</p>}
      {inviteLink && (
        <p>
          Share this link: <a className="text-primary-500" href={inviteLink}>{inviteLink}</a>
        </p>
      )}
    </div>
  );
};

export default InviteLink;
