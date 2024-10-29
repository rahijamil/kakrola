"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, MessageCircle, X } from "lucide-react";
import Image from "next/image";
import { supabaseBrowser } from "@/utils/supabase/client";
import { feedbackSchema } from "@/schemas/feedback";

export function FeedbackDialog() {
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [imageUploading, setImageUploading] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const form = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedback: "",
      metadata: {
        browser: navigator?.userAgent,
        url: window?.location.href,
        screenshots,
      },
    },
  });

  // Upload image to Supabase
  const uploadImage = async (file: File) => {
    const { data, error } = await supabaseBrowser.storage
      .from("feedback")
      .upload(`feedback/${Date.now()}_${file.name}`, file);

    if (error) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabaseBrowser.storage.from("feedback").getPublicUrl(data?.path);

    return publicUrl;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setImageUploading(true);

    const uploadedScreenshots: string[] = [];
    for (const file of Array.from(files)) {
      if (file.type.startsWith("image/")) {
        const url = await uploadImage(file);
        if (url) uploadedScreenshots.push(url);
      }
    }

    // Update screenshots state and form metadata
    setScreenshots((prev) => [...prev, ...uploadedScreenshots]);
    form.setValue("metadata.screenshots", [
      ...screenshots,
      ...uploadedScreenshots,
    ]);

    setImageUploading(false);
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmiting(true);
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit feedback");

      toast({
        title: "Feedback submitted successfully!",
        description: "Thank you for helping us improve.",
      });

      form.reset();
      setScreenshots([]);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error submitting feedback",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild className="fixed bottom-4 right-4 z-40 shadow-sm">
        <Button variant="outline" size="sm">
          <MessageCircle className="mr-2 h-4 w-4" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Help us improve by sharing your thoughts or reporting issues.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="If you see something, say something..."
                      className="h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Attachments</FormLabel>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="image-upload"
                    onChange={handleFileUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      document.getElementById("image-upload")?.click();
                    }}
                    disabled={imageUploading}
                  >
                    <ImagePlus className="mr-2 h-4 w-4" />
                    {imageUploading ? "Uploading..." : "Add screenshots"}
                  </Button>
                </div>
              </div>

              {screenshots.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {screenshots.map((screenshot, index) => (
                    <div key={index} className="relative aspect-video">
                      <Image
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        fill
                        className="object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1"
                        onClick={() => {
                          setScreenshots((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                          form.setValue(
                            "metadata.screenshots",
                            screenshots.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={imageUploading || isSubmiting}>
                {isSubmiting ? "Sending..." : "Send"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
