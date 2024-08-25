"use client";
import useTheme from "@/hooks/useTheme";
import React from "react";

const ThemeSettingsPage = () => {
  const { theme: currentTheme, setTheme } = useTheme();

  const ThemeSwitcher = () => {
    const themes: {
      name: string;
      value:
        | "kakrola"
        | "dark"
        | "moonstone"
        | "tangerine"
        | "kale"
        | "blueberry"
        | "lavender"
        | "raspberry";
      primaryColor: string;
      sidebarBg: string;
      mainBg: string;
      accentColor: string;
    }[] = [
      {
        name: "Kakrola",
        value: "kakrola",
        primaryColor: "#005c83",
        sidebarBg: "#f5f5f5",
        mainBg: "white",
        accentColor: "#e0e0e0",
      },
      {
        name: "Dark",
        value: "dark",
        primaryColor: "#8698c2",
        sidebarBg: "#1e1e1e",
        mainBg: "#252525",
        accentColor: "#333333",
      },
      {
        name: "Moonstone",
        value: "moonstone",
        primaryColor: "#0084bf",
        sidebarBg: "#f5f5f5",
        mainBg: "white",
        accentColor: "#e0e0e0",
      },
      {
        name: "Tangerine",
        value: "tangerine",
        primaryColor: "#d17c00",
        sidebarBg: "#f5f5f5",
        mainBg: "white",
        accentColor: "#e0e0e0",
      },
      {
        name: "Kale",
        value: "kale",
        primaryColor: "#297b2d",
        sidebarBg: "#f5f5f5",
        mainBg: "white",
        accentColor: "#e0e0e0",
      },
      {
        name: "Blueberry",
        value: "blueberry",
        primaryColor: "#1e88e5",
        sidebarBg: "#f5f5f5",
        mainBg: "white",
        accentColor: "#e0e0e0",
      },
      {
        name: "Lavender",
        value: "lavender",
        primaryColor: "#6c40ff",
        sidebarBg: "#f5f5f5",
        mainBg: "white",
        accentColor: "#e0e0e0",
      },
      {
        name: "Raspberry",
        value: "raspberry",
        primaryColor: "#d1003b",
        sidebarBg: "#f5f5f5",
        mainBg: "white",
        accentColor: "#e0e0e0",
      },
    ];

    return (
      <div className="flex flex-wrap gap-4">
        {themes.map((theme) => (
          <div
            key={theme.value}
            tabIndex={0}
            onClick={() => setTheme(theme.value)}
            className={`overflow-hidden rounded-lg border border-text-200 outline-none ${
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
                  style={{ backgroundColor: theme.accentColor }}
                ></div>
                <div
                  className="rounded-lg p-1 w-full"
                  style={{ backgroundColor: theme.accentColor }}
                ></div>
                <div
                  className="rounded-lg p-1 w-full"
                  style={{ backgroundColor: theme.accentColor }}
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
                  style={{ backgroundColor: theme.accentColor }}
                ></div>
                <div
                  className="rounded-lg p-1 w-full"
                  style={{ backgroundColor: theme.accentColor }}
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
