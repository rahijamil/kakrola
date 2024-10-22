"use client";

import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AtSign, Camera, Pencil, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { avatarUploader } from "@/utils/avatarUploader";
import {
  ActivityAction,
  createActivityLog,
  EntityType,
} from "@/types/activitylog";
import { usePathname } from "next/navigation";

// Form validation schema
const accountFormSchema = z.object({
  full_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export default function AccountSettings() {
  const { profile } = useAuthProvider();
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  // Initialize form with default values
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      email: profile?.email || "",
    },
  });

  const onSubmit = async (data: AccountFormValues) => {
    if (!profile?.id) return;
    setError(null);

    try {
      const { error: updateError } = await supabaseBrowser
        .from("profiles")
        .update({ full_name: data.full_name })
        .eq("id", profile?.id);

      if (updateError) throw updateError;

      createActivityLog({
        actor_id: profile.id,
        action: ActivityAction.UPDATED_PROFILE,
        entity: {
          type: EntityType.USER,
          id: profile.id,
          name: profile.full_name,
        },
        metadata: {
          old_data: { full_name: profile.full_name },
          new_data: { full_name: data.full_name },
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    setUploadLoading(true);
    setError(null);

    try {
      const file = event.target.files?.[0];
      if (!file || !profile) return;

      const newAvatarUrl = await avatarUploader(file, profile.id);
      setAvatarUrl(newAvatarUrl);

      createActivityLog({
        actor_id: profile.id,
        action: ActivityAction.UPDATED_PROFILE,
        entity: {
          type: EntityType.USER,
          id: profile.id,
          name: profile.full_name,
        },
        metadata: {
          old_data: { avatar_url: profile.avatar_url },
          new_data: { avatar_url: newAvatarUrl },
        },
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setError("Failed to upload avatar. Please try again.");
    } finally {
      setUploadLoading(false);
      event.target.value = "";
    }
  };

  const removeAvatar = async () => {
    if (!profile?.id) return;
    setRemoveLoading(true);
    setError(null);

    try {
      // Remove from storage
      if (profile.avatar_url) {
        const fileName = profile.avatar_url.split("/").pop();
        if (fileName) {
          await supabaseBrowser.storage.from("avatars").remove([fileName]);
        }
      }

      // Update profile
      await supabaseBrowser
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", profile.id);

      setAvatarUrl("/default_avatar.png");

      createActivityLog({
        actor_id: profile.id,
        action: ActivityAction.UPDATED_PROFILE,
        entity: {
          type: EntityType.USER,
          id: profile.id,
          name: profile.full_name,
        },
        metadata: {
          old_data: { avatar_url: profile.avatar_url },
          new_data: { avatar_url: null },
        },
      });
    } catch (error) {
      console.error("Error removing avatar:", error);
      setError("Failed to remove avatar. Please try again.");
    } finally {
      setRemoveLoading(false);
    }
  };

  return (
    <div>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your account settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Section */}
            <div className="space-y-4">
              <FormLabel>Profile Picture</FormLabel>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={avatarUrl || "/default_avatar.png"}
                      alt="Profile Picture"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    className="sr-only"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploadLoading}
                  />
                </div>

                <div className="space-y-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        {removeLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Remove Photo
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Remove Profile Picture
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove your profile picture and reset it to
                          the default avatar.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={removeAvatar}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <FormDescription>
                    Upload a photo up to 4MB. Your avatar will be public.
                  </FormDescription>
                </div>
              </div>
            </div>

            {/* Name Field */}
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      className="max-w-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      readOnly
                      className="max-w-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    Your email address is used for account-related
                    notifications.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Change Button */}
            <div className="grid gap-2">
              <FormLabel>Password</FormLabel>
              <Button
                type="button"
                variant="outline"
                className="max-w-sm"
                onClick={() =>
                  window.history.pushState(
                    null,
                    "",
                    `${pathname}?settings=account&tab=password`
                  )
                }
              >
                Change Password
              </Button>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="mt-6">
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
