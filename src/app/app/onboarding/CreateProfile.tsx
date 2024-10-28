"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { Upload } from "@/components/ui/Upload";
import { Input } from "@/components/ui/input";
import createPorfileImage from "./create_profile.png";
import { useRouter } from "next/navigation";
import OnboardWrapper from "./OnboardWrapper";
import Image from "next/image";
import { ProfileWithWorkspaces, useAuthProvider } from "@/context/AuthContext";
import Spinner from "@/components/ui/Spinner";
import { supabaseBrowser } from "@/utils/supabase/client";
import { avatarUploader } from "@/utils/avatarUploader";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { OnboardingStep } from "./onboarding.types";
import { useQueryClient } from "@tanstack/react-query";

interface CreateProfileProps {
  setStep: (step: OnboardingStep) => void;
}

const CreateProfile: React.FC<CreateProfileProps> = ({ setStep }) => {
  const { profile } = useAuthProvider();
  const [name, setName] = useState(profile?.full_name || "");
  const [fileUrl, setFileUrl] = useState<string | null>(
    profile?.avatar_url || null
  );
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleFileChange = (file: File | null) => {
    try {
      if (file && profile) {
        avatarUploader(file, profile.id).then((url) => {
          if (url) {
            setFileUrl(url);
          }
        });
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!name.trim() && !fileUrl && !profile?.id) {
        setLoading(false);
        return;
      }

      if (!profile?.id) return;

      setLoading(true);

      if (profile?.full_name !== name.trim()) {
        // optimistic update
        queryClient.setQueryData(
          ["profile", profile.id],
          (oldProfile: ProfileWithWorkspaces) => ({
            ...oldProfile,
            full_name: name.trim(),
            is_onboarded: true,
          })
        );
        const { error } = await supabaseBrowser
          .from("profiles")
          .update({
            full_name: name.trim(),
            is_onboarded: true,
          })
          .eq("id", profile?.id);

        if (error) {
          throw error;
        }
      } else {
        // optimistic update
        queryClient.setQueryData(
          ["profile", profile.id],
          (oldProfile: ProfileWithWorkspaces) => ({
            ...oldProfile,
            is_onboarded: true,
          })
        );

        const { error } = await supabaseBrowser
          .from("profiles")
          .update({
            is_onboarded: true,
          })
          .eq("id", profile?.id);

        if (error) {
          throw error;
        }
      }

      setStep("create-workspace");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <OnboardWrapper>
      <>
        <div className="space-y-1 text-center">
          <h1 className="text-lg font-semibold text-text-900">
            Create your profile
          </h1>
          <p className="text-text-500 text-lg">
            This is how you&apos;ll appear in Kakrola
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="upload-photo"
              className="mb-1 block text-sm font-medium text-text-700"
            >
              Upload your photo
            </label>
            <Upload
              id="upload-photo"
              className="w-full"
              Icon={UploadIcon}
              accept="image/*"
              onChange={handleFileChange}
              fileUrl={fileUrl}
              setFileUrl={setFileUrl}
            >
              Upload your photo
            </Upload>
          </div>

          <Input
            type="text"
            id="name"
            label="Your name"
            placeholder="E.g. Rahi Jamil"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!name.trim() || loading}
          fullWidth
        >
          {loading ? <Spinner color="white" /> : "Continue"}
        </Button>
      </>
    </OnboardWrapper>
  );
};

export default CreateProfile;
