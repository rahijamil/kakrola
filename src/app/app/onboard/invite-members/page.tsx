"use client";
import React from "react";
import OnboardWrapper from "../OnboardWrapper";
import { Button } from "@/components/ui/button";
import inviteMemberImage from "./invite_members.png";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Step5InviteMembers = () => {
  const router = useRouter();

  const handleSubmit = () => {
    router.push(`/app/${"teamId"}`);
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
            <Input
              type="text"
              id="email1"
              label="Email"
              placeholder="name@example.com"
              // value={name}
              // onChange={(e) => setName(e.target.value)}
            />

            <Input
              type="text"
              id="email2"
              label="Email"
              placeholder="name@example.com"
              // value={name}
              // onChange={(e) => setName(e.target.value)}
            />

            <Input
              type="text"
              id="email3"
              label="Email"
              placeholder="name@example.com"
              // value={name}
              // onChange={(e) => setName(e.target.value)}
            />

            <Button
              onClick={handleSubmit}
              disabled={false}
              fullWidth
              icon={Plus}
              variant="ghost"
              leftAlign
            >
              Add email
            </Button>

            <Button onClick={handleSubmit} disabled={false} fullWidth>
              Continue
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={false}
              fullWidth
              variant="gray"
            >
              Copy invite link
            </Button>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleSubmit}
              disabled={false}
              fullWidth
              variant="gray"
            >
              Skip for now
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
          className="object-cover rounded-lg"
        />
      }
      useWithTeam={true}
      currentStep={5}
    />
  );
};

export default Step5InviteMembers;
