"use client";
import React, { useState } from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { Upload } from "@/components/ui/Upload";
import { Input } from "@/components/ui/input";
import createPorfileImage from "./create-profile.png";
import { useRouter } from "next/navigation";
import OnboardWrapper from "../OnboardWrapper";

const Step1CreateProfile = () => {
  const [name, setName] = useState("");
  const [useWithTeam, setUseWithTeam] = useState(false);
  const router = useRouter();

  const handleFileChange = (file: File | null) => {
    if (file) {
      console.log("File selected:", file.name);
      // Here you would typically handle the file, e.g., upload it to a server
    }
  };

  const handleSubmit = () => {
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
              className="flex items-center justify-between w-full cursor-pointer rounded-lg border border-text-300 hover:border-text-400 focus:border-text-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-50 px-3 h-10"
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
            <Button onClick={handleSubmit} disabled={!name.trim()} fullWidth>
              Continue
            </Button>
          </div>
        </>
      }
      imageSrc={createPorfileImage}
      useWithTeam={useWithTeam}
      currentStep={1}
    />
  );
};

export default Step1CreateProfile;
