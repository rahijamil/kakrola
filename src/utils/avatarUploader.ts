import { supabaseBrowser } from "./supabase/client";

export const avatarUploader: (
  file: File,
  proifleId: string
) => Promise<string> = async (file: File, proifleId: string) => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${file.name.split(".")[0]}-${proifleId}.${fileExt}`;
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
      .eq("id", proifleId);

    if (updateError) throw updateError;

    return publicUrl;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};
