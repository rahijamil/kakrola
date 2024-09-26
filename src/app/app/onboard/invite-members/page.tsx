"use client";
import React, { useState } from "react";
import OnboardWrapper from "../OnboardWrapper";
import { Button } from "@/components/ui/button";
import inviteMemberImage from "./invite_members.png";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Spinner from "@/components/ui/Spinner";
import axios from "axios";
import { useAuthProvider } from "@/context/AuthContext";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import InviteLink from "./InviteLink";

const Step5InviteMembers = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const team_id = searchParams.get("team_id");
  const [loading, setLoading] = useState(false);
  const [skipLoading, setSkipLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Error state

  const { profile } = useAuthProvider();

  const [invites, setInvites] = useState<{ email: string }[]>([
    { email: "" },
    { email: "" },
    { email: "" },
  ]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    if (!profile || !team_id) {
      setLoading(false);
      setError("Profile or Team ID is missing.");
      return;
    }

    // Filter valid emails
    const validEmails = invites
      .map((invite) => invite.email.trim())
      .filter((email) =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
      );

    if (validEmails.length === 0) {
      setError("Please enter at least one valid email address.");
      setLoading(false);
      return;
    }

    try {
      // Send all invites in one request to the server
      const response = await axios.post("/api/invite/invite-members", {
        emails: validEmails,
        team_id,
        inviter: {
          id: profile.id,
          first_name: profile.full_name.split(" ")[0] || "User",
          email: profile.email,
        },
      });

      if (response.data.success) {
        router.push(`/app/${team_id}`);
      } else {
        setError(response.data.message);
      }
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
    <OnboardWrapper
      leftSide={
        <>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-text-900">
              Invite people <br /> to your team
            </h1>
            <p className="text-text-500">
              Members will be able to browse and join team projects. (You can
              create private ones, too.)
            </p>
          </div>

          <div className="space-y-4">
            {invites.map((invite, index) => (
              <Input
                key={index}
                type="text"
                id={`email-${index}`}
                label="Email"
                placeholder="name@example.com"
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
            {error && <p className="text-red-500">{error}</p>}{" "}
            {/* Error message */}
            <Button onClick={handleSubmit} disabled={loading} fullWidth>
              {loading ? <Spinner color="white" /> : "Continue"}
            </Button>
            <InviteLink team_id={parseInt(team_id!)} />
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => {
                setSkipLoading(true);
                router.push(`/app/${team_id}`);
              }}
              disabled={skipLoading}
              fullWidth
              variant="gray"
            >
              {skipLoading ? <Spinner color="current" /> : "Skip for now"}
            </Button>

            <p className="text-xs text-text-500">
              By creating a team, you agree to our{" "}
              <span className="underline">Terms of Service</span> <br />{" "}
              regarding team workspaces.
            </p>
          </div>
        </>
      }
      rightSide={
        <Image
          src={inviteMemberImage}
          width={300}
          height={300}
          alt="Use Case"
          className="object-cover"
        />
      }
      useWithTeam={true}
      currentStep={5}
    />
  );
};

export default Step5InviteMembers;
