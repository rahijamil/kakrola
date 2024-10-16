"use client";
import useTheme from "@/hooks/useTheme";
import { Theme } from "@/lib/theme.types";
import React from "react";

const ThemeSettingsPage = () => {
  const { theme: currentTheme, setTheme } = useTheme();

  const ThemeSwitcher = () => {
    const themes: {
      name: string;
      value: Theme;
      primaryColor: string;
      sidebarBg: string;
      sidebarAccentColor1: string;
      sidebarAccentColor2: string;
      mainBg: string;
      mainAccentColor: string;
    }[] = [
      {
        name: "Kakrola",
        value: Theme.KAKROLA,
        primaryColor: "#005c83",
        sidebarBg: "#f0f7fa",
        sidebarAccentColor1: "#c3dfeb",
        sidebarAccentColor2: "#e1eff5",
        mainBg: "white",
        mainAccentColor: "#e0e0e0",
      },
      {
        name: "Dark",
        value: Theme.KAKROLA_DARK,
        primaryColor: "#8698c2",
        sidebarBg: "#1e1e1e",
        sidebarAccentColor1: "#2d3642",
        sidebarAccentColor2: "#23282f",
        mainBg: "#252525",
        mainAccentColor: "#333333",
      },
      {
        name: "Moonstone",
        value: Theme.MOONSTONE,
        primaryColor: "#39485e",
        sidebarBg: "#e6e9ef",
        sidebarAccentColor1: "#99a7bf",
        sidebarAccentColor2: "#ccd3df",
        mainBg: "white",
        mainAccentColor: "#e0e0e0",
      },
      {
        name: "Tangerine",
        value: Theme.TANGERINE,
        primaryColor: "#d17c00",
        sidebarBg: "#faf2e6",
        sidebarAccentColor1: "#ebcb9b",
        sidebarAccentColor2: "#f5e5cd",
        mainBg: "white",
        mainAccentColor: "#e0e0e0",
      },
      {
        name: "Kale",
        value: Theme.KALE,
        primaryColor: "#297b2d",
        sidebarBg: "#e8efe8",
        sidebarAccentColor1: "#a3bfa3",
        sidebarAccentColor2: "#d1dfd1",
        mainBg: "white",
        mainAccentColor: "#e0e0e0",
      },
      {
        name: "Blueberry",
        value: Theme.BLUEBERRY,
        primaryColor: "#1e88e5",
        sidebarBg: "#e7f3fb",
        sidebarAccentColor1: "#9fcfef",
        sidebarAccentColor2: "#cfe7f7",
        mainBg: "white",
        mainAccentColor: "#e0e0e0",
      },
      {
        name: "Lavender",
        value: Theme.LAVENDER,
        primaryColor: "#6c40ff",
        sidebarBg: "#f1edff",
        sidebarAccentColor1: "#c7b7ff",
        sidebarAccentColor2: "#e3dbff",
        mainBg: "white",
        mainAccentColor: "#e0e0e0",
      },
      {
        name: "Raspberry",
        value: Theme.RASPBERRY,
        primaryColor: "#d1003b",
        sidebarBg: "#fce6eb",
        sidebarAccentColor1: "#f39bb0",
        sidebarAccentColor2: "#f9cdd7",
        mainBg: "white",
        mainAccentColor: "#e0e0e0",
      },
    ];

    return (
      <div className="flex flex-wrap gap-4">
        {themes.map((theme) => (
          <div
            key={theme.value}
            tabIndex={0}
            onClick={() => setTheme(theme.value)}
            className={`overflow-hidden rounded-lg border border-text-100 outline-none ${
              currentTheme == theme.value && "ring-primary-500 ring-2"
            } ring-offset-2 flex h-full cursor-pointer hover:translate-y-2 hover:scale-110 transition-all duration-300`}
            style={{
              width: "200px",
              height: "100px",
              backgroundColor: theme.sidebarBg,
            }}
          >
            <div
              className="w-1/4 p-1"
              style={{ width: "30%", backgroundColor: theme.sidebarBg }}
            >
              <ul className="space-y-1">
                <li
                  className="rounded-lg p-1"
                  style={{ backgroundColor: theme.primaryColor }}
                ></li>
                <div
                  className="rounded-lg p-1 w-full"
                  style={{ backgroundColor: theme.sidebarAccentColor1 }}
                ></div>
                <div
                  className="rounded-lg p-1 w-full"
                  style={{ backgroundColor: theme.sidebarAccentColor2 }}
                ></div>
                <div
                  className="rounded-lg p-1 w-full"
                  style={{ backgroundColor: theme.sidebarAccentColor2 }}
                ></div>
              </ul>
            </div>
            <div
              className="flex-1 p-2 py-1 space-y-2"
              style={{ backgroundColor: theme.mainBg }}
            >
              <span
                className="font-semibold text-xs"
                style={{ color: theme.primaryColor }}
              >
                {theme.name}
              </span>

              <div className="space-y-2">
                <div
                  className="rounded-lg p-1 w-full"
                  style={{ backgroundColor: theme.mainAccentColor }}
                ></div>
                <div
                  className="rounded-lg p-1 w-full"
                  style={{ backgroundColor: theme.mainAccentColor }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <ThemeSwitcher />
    </div>
  );
};

export default ThemeSettingsPage;
