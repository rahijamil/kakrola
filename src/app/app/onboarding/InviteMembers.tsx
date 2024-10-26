"use client";
import React, { useState } from "react";
import OnboardWrapper from "./OnboardWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import axios from "axios";
import { useAuthProvider } from "@/context/AuthContext";
import InviteLink from "./InviteLink";
import { supabaseBrowser } from "@/utils/supabase/client";

const InviteMembers = () => {
  const searchParams = useSearchParams();
  const team_id = searchParams.get("team_id");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Error state

  const { profile } = useAuthProvider();
  const router = useRouter();

  const [invites, setInvites] = useState<{ email: string }[]>([
    { email: "" },
    { email: "" },
    { email: "" },
  ]);

  const finishOnboarding = async () => {
    try {
      if (!profile?.id) throw new Error("Profile not found");

      const { data, error } = await supabaseBrowser
        .from("profiles")
        .update({ is_onboarded: true })
        .eq("id", profile.id);

      if (error) throw error;

      router.push("/app");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Filter valid emails
    const validEmails = invites
      .map((invite) => invite.email.trim())
      .filter((email) =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
      );

    // if (validEmails.length === 0) {
    //   setError("Please enter at least one valid email address.");
    //   setLoading(false);
    //   return;
    // }

    try {
      if (validEmails.length > 0) {
        if (!profile || !team_id) {
          setLoading(false);
          setError("Profile or Team ID is missing.");
          return;
        }

        // Send all invites in one request to the server
        const response = await axios.post("/api/invite/invite-members", {
          emails: validEmails,
          team_id,
          inviter: {
            id: profile.id,
            first_name: profile.full_name.split(" ")[0] || "User",
            email: profile.email,
            avatar_url: profile.avatar_url,
          },
        });

        if (response.data.success) {
          finishOnboarding();
        } else {
          setError(response.data.message);
        }
      }

      finishOnboarding();
    } catch (error: any) {
      setError(
        error.response.data.message ||
          "An unexpected error occurred. Please try again."
      );
      console.error("Error sending invites:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardWrapper>
      <>
        <div className="space-y-1 text-center">
          <h1 className="text-lg font-semibold text-text-900">
            Start with your team
          </h1>
          <p className="text-text-500 text-lg">
            Kakrola works best with your teammates
          </p>
        </div>
        <div className="space-y-4">
          {invites.map((invite, index) => (
            <Input
              key={index}
              type="text"
              id={`email-${index}`}
              label={index == 0 ? "Invite people" : undefined}
              placeholder="Email"
              value={invite.email}
              onChange={(e) => {
                const newInvites = [...invites];
                newInvites[index].email = e.target.value;
                setInvites(newInvites);
              }}
            />
          ))}

          <Button
            onClick={() => {
              setInvites([...invites, { email: "" }]);
            }}
            disabled={loading}
            fullWidth
            icon={Plus}
            variant="ghost"
            leftAlign
          >
            Add email
          </Button>
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>

        <div className="space-y-4">
          <InviteLink team_id={parseInt(team_id!)} />
          <Button onClick={handleSubmit} disabled={loading} fullWidth>
            {loading ? <Spinner color="current" /> : "Take me to Kakrola"}
          </Button>
        </div>
      </>
    </OnboardWrapper>
  );
};

export default InviteMembers;