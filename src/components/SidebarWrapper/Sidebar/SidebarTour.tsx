import React from "react";
import Joyride, {
  ACTIONS,
  EVENTS,
  ORIGIN,
  STATUS,
  CallBackProps,
} from "react-joyride";
import useTheme from "@/hooks/useTheme";
import { ThemeMode } from "@/lib/theme.types";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";

const steps = [
  {
    target: "#joyride_workspace",
    title: "Welcome to your workspace",
    content:
      "A workspace is a virtual home to create, organize, and shate content",
    disableBeacon: true,
  },
  {
    target: "#joyride_sidebar_menu_items",
    title: "Get started with your sidebar",
    content: "Jump to pages, keep track of work, and access workspace settings",
    disableBeacon: true,
  },
  {
    target: "#joyride_teamspaces",
    title: "Every team side-by-side",
    content:
      "Teamspaces are dedicated spaces to help keep every team's unique content and workflows organized",
    disableBeacon: true,
  },
];

const SidebarTour = () => {
  const { themeMode } = useTheme();
  const { profile } = useAuthProvider();

  const handleJoyrideCallback = async (data: CallBackProps) => {
    try {
      if (!profile?.id) return;

      const { status } = data;

      if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
        const { data, error } = await supabaseBrowser
          .from("profiles")
          .update({ metadata: { ...profile.metadata, is_toured: true } })
          .eq("id", profile.id);

        if (error) throw error;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Joyride
      steps={steps}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          backgroundColor: themeMode == ThemeMode.DARK ? "#1f1f1f" : "#ffffff",
          primaryColor:
            themeMode == ThemeMode.DARK
              ? "hsl(221, 48%, 75%)"
              : "hsl(198, 100%, 26%)",
          textColor: themeMode == ThemeMode.DARK ? "#b3b3b3" : "#333333",
          // width: 900,
          // zIndex: 1000,
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
};

export default SidebarTour;
