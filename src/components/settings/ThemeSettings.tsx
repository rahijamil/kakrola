"use client";
import useTheme from "@/hooks/useTheme";
import { Theme } from "@/lib/theme.types";
import React from "react";

const ThemeSettingsPage = () => {
  const { theme: currentTheme, setTheme } = useTheme();

  const themeGroups: {
    id: number;
    name: Theme;
    light: {
      name: string;
      value: Theme;
      primaryColor: string;
      sidebarBg: string;
      sidebarAccentColor1: string;
      sidebarAccentColor2: string;
      mainBg: string;
      mainAccentColor: string;
    };
    dark: {
      name: string;
      value: Theme;
      primaryColor: string;
      sidebarBg: string;
      sidebarAccentColor1: string;
      sidebarAccentColor2: string;
      mainBg: string;
      mainAccentColor: string;
    };
  }[] = [
    {
      id: 1,
      name: Theme.KAKROLA,
      light: {
        name: "Kakrola",
        value: Theme.KAKROLA,
        primaryColor: "#005c83",
        sidebarBg: "#f0f7fa",
        sidebarAccentColor1: "#c3dfeb",
        sidebarAccentColor2: "#e1eff5",
        mainBg: "white",
        mainAccentColor: "#e0e0e0",
      },
      dark: {
        name: "Dark",
        value: Theme.KAKROLA_DARK,
        primaryColor: "#8698c2",
        sidebarBg: "#1e1e1e",
        sidebarAccentColor1: "#2d3642",
        sidebarAccentColor2: "#23282f",
        mainBg: "#252525",
        mainAccentColor: "#333333",
      },
    },
    // {
    //   id: 2,
    //   name: Theme.MOONSTONE,
    //   light: {
    //     name: "Moonstone",
    //     value: Theme.MOONSTONE,
    //     primaryColor: "#39485e",
    //     sidebarBg: "#e6e9ef",
    //     sidebarAccentColor1: "#99a7bf",
    //     sidebarAccentColor2: "#ccd3df",
    //     mainBg: "white",
    //     mainAccentColor: "#e0e0e0",
    //   },
    //   dark: {
    //     name: "Moonstone",
    //     value: Theme.MOONSTONE_DARK,
    //     primaryColor: "#66799f",
    //     sidebarBg: "#222b3a",
    //     sidebarAccentColor1: "#313e54",
    //     sidebarAccentColor2: "#2a3547",
    //     mainBg: "#252525",
    //     mainAccentColor: "#333333",
    //   },
    // },
    // {
    //   id: 3,
    //   name: Theme.TANGERINE,
    //   light: {
    //     name: "Tangerine",
    //     value: Theme.TANGERINE,
    //     primaryColor: "#d17c00",
    //     sidebarBg: "#faf2e6",
    //     sidebarAccentColor1: "#ebcb9b",
    //     sidebarAccentColor2: "#f5e5cd",
    //     mainBg: "white",
    //     mainAccentColor: "#e0e0e0",
    //   },
    //   dark: {
    //     name: "Tangerine",
    //     value: Theme.TANGERINE_DARK,
    //     primaryColor: "#e1b169",
    //     sidebarBg: "#6b4000",
    //     sidebarAccentColor1: "#af6800",
    //     sidebarAccentColor2: "#8d5400",
    //     mainBg: "#252525",
    //     mainAccentColor: "#333333",
    //   },
    // },
    // {
    //   id: 4,
    //   name: Theme.KALE,
    //   light: {
    //     name: "Kale",
    //     value: Theme.KALE,
    //     primaryColor: "#297b2d",
    //     sidebarBg: "#e8efe8",
    //     sidebarAccentColor1: "#a3bfa3",
    //     sidebarAccentColor2: "#d1dfd1",
    //     mainBg: "white",
    //     mainAccentColor: "#e0e0e0",
    //   },
    //   dark: {
    //     name: "Kale",
    //     value: Theme.KALE_DARK,
    //     primaryColor: "#759f75",
    //     sidebarBg: "#143f18",
    //     sidebarAccentColor1: "#226726",
    //     sidebarAccentColor2: "#1b531f",
    //     mainBg: "#252525",
    //     mainAccentColor: "#333333",
    //   },
    // },
    // {
    //   id: 5,
    //   name: Theme.BLUEBERRY,
    //   light: {
    //     name: "Blueberry",
    //     value: Theme.BLUEBERRY,
    //     primaryColor: "#1e88e5",
    //     sidebarBg: "#e7f3fb",
    //     sidebarAccentColor1: "#9fcfef",
    //     sidebarAccentColor2: "#cfe7f7",
    //     mainBg: "white",
    //     mainAccentColor: "#e0e0e0",
    //   },
    //   dark: {
    //     name: "Blueberry",
    //     value: Theme.BLUEBERRY_DARK,
    //     primaryColor: "#6fb7e7",
    //     sidebarBg: "#0f4679",
    //     sidebarAccentColor1: "#1972c1",
    //     sidebarAccentColor2: "#145c9d",
    //     mainBg: "#252525",
    //     mainAccentColor: "#333333",
    //   },
    // },
    // {
    //   id: 6,
    //   name: Theme.LAVENDER,
    //   light: {
    //     name: "Lavender",
    //     value: Theme.LAVENDER,
    //     primaryColor: "#6c40ff",
    //     sidebarBg: "#f1edff",
    //     sidebarAccentColor1: "#c7b7ff",
    //     sidebarAccentColor2: "#e3dbff",
    //     mainBg: "white",
    //     mainAccentColor: "#e0e0e0",
    //   },
    //   dark: {
    //     name: "Lavender",
    //     value: Theme.LAVENDER_DARK,
    //     primaryColor: "#ab93ff",
    //     sidebarBg: "#392284",
    //     sidebarAccentColor1: "#5b36d6",
    //     sidebarAccentColor2: "#4a2cad",
    //     mainBg: "#252525",
    //     mainAccentColor: "#333333",
    //   },
    // },
    // {
    //   id: 6,
    //   name: Theme.RASPBERRY,
    //   light: {
    //     name: "Raspberry",
    //     value: Theme.RASPBERRY,
    //     primaryColor: "#d1003b",
    //     sidebarBg: "#fce6eb",
    //     sidebarAccentColor1: "#f39bb0",
    //     sidebarAccentColor2: "#f9cdd7",
    //     mainBg: "white",
    //     mainAccentColor: "#e0e0e0",
    //   },
    //   dark: {
    //     name: "Raspberry",
    //     value: Theme.RASPBERRY_DARK,
    //     primaryColor: "#ed6988",
    //     sidebarBg: "#6b0020",
    //     sidebarAccentColor1: "#af0032",
    //     sidebarAccentColor2: "#8d0029",
    //     mainBg: "#252525",
    //     mainAccentColor: "#333333",
    //   },
    // },
  ];

  return (
    <div className="w-fit mx-auto">
      {themeGroups.map(({ id, name, light, dark }) => (
        <div key={id}>
          <div className="space-y-1">
            <div>
              <h3 className="capitalize font-bold">{name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 w-fit">
              {Array.from([light, dark]).map((theme) => (
                <div
                  key={theme.value}
                  tabIndex={0}
                  onClick={() => setTheme(theme.value)}
                  className={`overflow-hidden rounded-lg border border-text-100 outline-none ${
                    currentTheme == theme.value && "ring-primary-500 ring-2"
                  } ring-offset-2 flex h-full cursor-pointer transition-all duration-300 hover:shadow-[2px_2px_16px_0px_rgba(0,0,0,0.5)] dark:hover:shadow-[2px_2px_16px_0px_rgba(255,255,255,.8)] w-[200px] aspect-[4/2.5]`}
                  style={{
                    backgroundColor: theme.sidebarBg,
                  }}
                >
                  <div className="w-1/4 p-1">
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
                    className={`flex-1 px-2 p-1 space-y-2 ml-0 m-0.5 border rounded-lg shadow-[.5px_.5px_4px_0px_rgba(0,0,0,0.1)] ${
                      theme.value.endsWith("dark")
                        ? "border-[#2a2a2a]"
                        : "border-[#ebebeb]"
                    }`}
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
          </div>

          <div className="h-px w-full bg-text-100 my-4"></div>
        </div>
      ))}
    </div>
  );
};

export default ThemeSettingsPage;
