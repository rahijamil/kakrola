"use client";
import React, { useState } from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { Upload } from "@/components/ui/Upload";
import { Input } from "@/components/ui/input";
import createPorfileImage from "./create_profile.png";
import { useRouter } from "next/navigation";
import OnboardWrapper from "../OnboardWrapper";
import Image from "next/image";
import { useAuthProvider } from "@/context/AuthContext";
import Spinner from "@/components/ui/Spinner";
import { supabaseBrowser } from "@/utils/supabase/client";
import { avatarUploader } from "@/utils/avatarUploader";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";

const Step1CreateProfile = () => {
  const { profile } = useAuthProvider();
  const [name, setName] = useState(profile?.full_name || "");
  const [useWithTeam, setUseWithTeam] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(
    profile?.avatar_url || null
  );
  const router = useRouter();
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
        const { error } = await supabaseBrowser
          .from("profiles")
          .update({
            full_name: name.trim(),
          })
          .eq("id", profile?.id);

        if (error) {
          throw error;
        }

        createActivityLog({
          actor_id: profile.id,
          action: ActivityAction.UPDATED_PROFILE,
          entity: {
            type: EntityType.USER,
            id: profile.id,
            name: profile.full_name,
          },
          metadata: {
            old_data: {
              full_name: profile?.full_name,
            },
            new_data: {
              full_name: name.trim(),
            },
          },
        });
      }

      if (useWithTeam) {
        router.push("/app/onboard/customize-kakrola");
      } else {
        router.push("/app/onboard/use-case");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <OnboardWrapper
      leftSide={
        <>
          <div className="space-y-3 text-center">
            <h1 className="text-xl md:text-3xl font-bold text-text-900">
              Create your profile
            </h1>
            <p className="text-text-500">
              This is how you&apos;ll appear in Kakrola
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="upload-photo"
                className="block text-sm font-bold text-text-700 mb-2"
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

            <button
              type="button"
              onClick={() => setUseWithTeam(!useWithTeam)}
              className="flex items-center justify-between w-full cursor-pointer rounded-lg border border-text-300 hover:border-text-400 focus:border-text-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-50 px-3 md:px-4 min-h-10 gap-1"
            >
              <span className="font-medium text-text-700">
                I want to use Kakrola with my team
              </span>
              <div className="pointer-events-none h-5">
                <ToggleSwitch
                  checked={useWithTeam}
                  onCheckedChange={setUseWithTeam}
                  size="sm"
                />
              </div>
            </button>
            <Button
              onClick={handleSubmit}
              disabled={!name.trim() || loading}
              fullWidth
            >
              {loading ? <Spinner color="white" /> : "Continue"}
            </Button>
          </div>
        </>
      }
      rightSide={
        <Image
          src={createPorfileImage}
          width={300}
          height={300}
          alt="Use Case"
          className="object-cover"
        />
      }
      useWithTeam={useWithTeam}
      currentStep={1}
    />
  );
};

export default Step1CreateProfile;
