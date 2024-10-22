import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function parseCSV(csvText: string) {
  // You might want to use a CSV parsing library like papaparse here
  const lines = csvText.split("\n");
  const headers = lines[0].split(",");

  return {
    headers,
    rows: lines.slice(1).map((line) => {
      const values = line.split(",");
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index]?.trim();
        return obj;
      }, {} as Record<string, string>);
    }),
  };
}
