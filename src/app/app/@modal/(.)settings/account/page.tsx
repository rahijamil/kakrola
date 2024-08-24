"use client";

import { ChangeEvent, useState } from "react";
import { AtSign, TrashIcon, User } from "lucide-react";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import Spinner from "@/components/ui/Spinner";

export default function AccountSettingsPage() {
  const { profile } = useAuthProvider();
  const [name, setName] = useState(profile?.full_name || "");
  const [email, setEmail] = useState(profile?.email);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const [uploadLoading, setUploadLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    setUploadLoading(true);
    setError(null);

    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${file.name.split(".")[0]}-${profile?.id}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload image to Supabase storage
      const { data, error: uploadError } = await supabaseBrowser.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL for the uploaded avatar
      const {
        data: { publicUrl },
      } = supabaseBrowser.storage.from("avatars").getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabaseBrowser
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", profile?.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setError("Failed to upload avatar. Please try again.");
    } finally {
      setUploadLoading(false);
      event.target.value = "";
    }
  };

  const removeAvatar = async () => {
    setRemoveLoading(true);
    setError(null);

    try {
      // Get the current avatar URL from the profile
      const avatarUrl = profile?.avatar_url;

      if (avatarUrl) {
        // Extract the file name from the URL
        const fileName = avatarUrl.split("/").pop();

        if (fileName) {
          // Remove the avatar from Supabase storage
          const { error: removeError } = await supabaseBrowser.storage
            .from("avatars")
            .remove([fileName]);

          if (removeError) throw removeError;
        }
      }

      // Update profile to remove avatar URL
      const { error: updateError } = await supabaseBrowser
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", profile?.id);

      if (updateError) throw updateError;

      setAvatarUrl(null);
    } catch (error) {
      console.error("Error removing avatar:", error);
      setError("Failed to remove avatar. Please try again.");
    } finally {
      setRemoveLoading(false);
    }
  };

  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const handleNameChange = async () => {
    setIsUpdatingName(true);
    setError(null);

    try {
      const { error: updateError } = await supabaseBrowser
        .from("profiles")
        .update({ full_name: name })
        .eq("id", profile?.id);

      if (updateError) throw updateError;
    } catch (error) {
      console.error("Error updating name:", error);
      setError("Failed to update name. Please try again.");
    } finally {
      setIsUpdatingName(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        {/* <section className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Plan</h2>
          <p className="text-sm text-text-500">Beginner</p>
        </div>
        <Button variant="outline" size="sm">
          Manage plan
        </Button>
      </section>

      <div className="h-[1px] bg-text-50"></div> */}

        {error && <p className="text-red-500">{error}</p>}

        <section className="space-y-4 max-w-sm">
          <div>
            <label className="font-bold">Profile</label>

            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 min-w-16 min-h-16 rounded-full relative bg-text-50 overflow-hidden">
                <Image
                  src={avatarUrl || "/default-avatar.png"}
                  alt="Profile Picture"
                  fill
                  objectFit="cover"
                />
              </div>

              <div>
                <div className="flex items-center justify-center">
                  <input
                    type="file"
                    id="avatar-upload"
                    className="sr-only"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploadLoading}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`border cursor-pointer h-9 inline-flex items-center justify-center gap-2 rounded-lg px-3 borderindigo600 textindigo600 ${
                      uploadLoading ? "opacity-50" : "hover:bgindigo50"
                    }`}
                  >
                    {uploadLoading ? (
                      <>
                        <Spinner /> <span>Changing...</span>
                      </>
                    ) : (
                      "Change photo"
                    )}
                  </label>
                  <Button
                    variant="outline"
                    color="red"
                    size="sm"
                    className="ml-2"
                    onClick={removeAvatar}
                    disabled={removeLoading}
                  >
                    {removeLoading ? (
                      <>
                        <Spinner /> <span>Removing...</span>
                      </>
                    ) : (
                      "Remove photo"
                    )}
                  </Button>
                </div>
                <p className="text-xs text-text-500 mt-1">
                  Pick a photo up to 4MB. Your avatar photo will be public.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Input
              id="name"
              label="Name"
              placeholder="Enter your name"
              Icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {name?.trim().length > 0 && name !== profile?.full_name && (
              <Button
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={handleNameChange}
                disabled={isUpdatingName}
              >
                {isUpdatingName ? (
                  <>
                    <Spinner /> <span>Updating...</span>
                  </>
                ) : (
                  "Update name"
                )}
              </Button>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <Input
              id="email"
              label="Email"
              placeholder="Enter your email"
              Icon={AtSign}
              value={email}
              // onChange={(e) => setEmail(e.target.value)}
              readOnly
            />
            {/* <Button variant="outline" size="sm" className="w-fit">
            Change email
          </Button> */}
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-bold">Password</label>
            <Link href="/app/settings/account/password" className="w-fit">
              <Button variant="outline" size="sm" className="w-fit">
                Add Password
              </Button>
            </Link>
          </div>

          {/* <div className="space-y-1">
          <p className="font-bold">Two-factor authentication</p>
          <ToggleSwitch
            id="2fa"
            size="sm"
            checked={twoFactorAuth}
            onCheckedChange={() => setTwoFactorAuth(!twoFactorAuth)}
          />
          <p className="text-sm text-text-500">
            2FA is {twoFactorAuth ? "enabled" : "disabled"} on your Todoist
            account.
          </p>
        </div> */}
        </section>

        {/* <div className="h-[1px] bg-text-50"></div> */}

        {/* <section className="space-y-3">
        <div className="space-y-1">
          <h3 className="font-bold">Connected accounts</h3>
          <p className="text-xs text-text-500">
            Log in to Todoist with your Google, Facebook, or Apple account.
          </p>
        </div>
        <p className="text-sm text-text-700">
          You can log in to Todoist with your Google account {email}.
        </p>
        <p className="text-sm text-text-500">
          Your password is not set, so we cannot disconnect you from your Google
          account. If you want to disconnect, please{" "}
          <a href="#" className="text-blue-500">
            set up your password
          </a>{" "}
          first.
        </p>

        <div className="space-y-2 max-w-sm">
          <Button variant="outline" size="sm" className="w-full mt-2">
            <div className="flex items-center justify-center space-x-2">
              <i className="fab fa-facebook-square"></i>{" "}
              <span>Connect with Facebook</span>
            </div>
          </Button>

          <Button variant="outline" size="sm" className="w-full mt-2">
            <div className="flex items-center justify-center space-x-2">
              <i className="fab fa-apple"></i>{" "}
              <span>Connect with Apple</span>
            </div>
          </Button>
        </div>
      </section>

      <div className="h-[1px] bg-text-50"></div> */}

        {/* <section className="space-y-3">
        <div className="space-y-1">
          {" "}
          <h3 className="font-bold">Delete account</h3>
          <p className="text-text-500 text-xs">
            This will immediately delete all of your data including tasks,
            projects, comments, and more. This can’t be undone.
          </p>
        </div>
        <Button variant="outline" color="red" size="sm" className="mt-2">
          <TrashIcon className="w-5 h-5 mr-2" />
          Delete account
        </Button>
      </section> */}
      </div>
    </div>
  );
}
