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

const Step1CreateProfile = () => {
  const { profile } = useAuthProvider();
  const [name, setName] = useState(profile?.full_name || "");
  const [useWithTeam, setUseWithTeam] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file) {
      console.log("File selected:", file.name);
      // Here you would typically handle the file, e.g., upload it to a server
    }
  };

  const handleSubmit = () => {
    setLoading(true);





// today you'll work here, In Sha Allah!











    if (useWithTeam) {
      router.push("/app/onboard/customize-kakrola");
    } else {
      router.push("/app/onboard/use-case");
    }
  };

  return (
    <OnboardWrapper
      leftSide={
        <>
          {" "}
          <h1 className="text-3xl font-bold text-text-900">
            Create your profile
          </h1>
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
                avatarUrl={profile?.avatar_url!}
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
              className="flex items-center justify-between w-full cursor-pointer rounded-full border border-text-300 hover:border-text-400 focus:border-text-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-50 px-4 h-12"
            >
              <span className="text-sm font-medium text-text-700">
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
          className="object-cover rounded-lg"
        />
      }
      useWithTeam={useWithTeam}
      currentStep={1}
    />
  );
};

export default Step1CreateProfile;
