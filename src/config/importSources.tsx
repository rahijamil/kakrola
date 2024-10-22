// config/importSources.tsx
import { AnyImportSource, ImportSourceType } from "@/types/import";
import { FileText, Trello, Slack, Upload, FileSpreadsheet } from "lucide-react";
import { SiGoogledocs, SiNotion } from "react-icons/si";

const NOTION_CLIENT_ID = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID;

export const importSources: AnyImportSource[] = [
  // {
  //   id: "notion",
  //   name: "Notion",
  //   type: ImportSourceType.PLATFORM,
  //   description: "Import directly from your Notion workspace",
  //   icon: <SiNotion className="w-6 h-6" />,
  //   auth_url: (currentPathname: string) =>
  //     `https://api.notion.com/v1/oauth/authorize?client_id=${NOTION_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(
  //       process.env.NEXT_PUBLIC_APP_URL + "/api/import/notion/callback"
  //     )}&state=${currentPathname}`,

  //   api_base: "https://api.notion.com/v1",
  //   scopes: ["read_content", "read_user"],
  // },
  {
    id: "google_docs",
    name: "Google Docs",
    type: ImportSourceType.PLATFORM,
    description: "Import from Google Docs",
    icon: <SiGoogledocs className="w-6 h-6" />,
    auth_url: (currentPathname: string) => "https://trello.com/1/authorize",
    api_base: "https://api.trello.com/1",
    scopes: ["read", "account"],
  },
  {
    id: "trello",
    name: "Trello",
    type: ImportSourceType.PLATFORM,
    description: "Import your Trello boards and cards",
    icon: <Trello className="w-6 h-6" />,
    auth_url: (currentPathname: string) => "https://trello.com/1/authorize",
    api_base: "https://api.trello.com/1",
    scopes: ["read", "account"],
  },
  {
    id: "slack",
    name: "Slack",
    type: ImportSourceType.PLATFORM,
    description: "Import from Slack channels and messages",
    icon: <Slack className="w-6 h-6" />,
    auth_url: (currentPathname: string) =>
      "https://slack.com/oauth/v2/authorize",
    api_base: "https://slack.com/api",
    scopes: ["channels:read", "channels:history", "users:read"],
  },
  {
    id: "csv",
    name: "CSV File",
    type: ImportSourceType.FILES,
    description: "Import from CSV spreadsheet",
    icon: <FileSpreadsheet className="w-6 h-6" />,
    accepted_extensions: [".csv"],
    max_size_mb: 10,
  },
  {
    id: "text",
    name: "Text File",
    type: ImportSourceType.FILES,
    description: "Import from plain text file",
    icon: <FileText className="w-6 h-6" />,
    accepted_extensions: [".txt"],
    max_size_mb: 5,
  },
  {
    id: "paste",
    name: "Paste Text",
    type: ImportSourceType.PASTE,
    description: "Paste content directly",
    icon: <Upload className="w-6 h-6" />,
    template: "Title\nDescription\n- Item 1\n- Item 2",
  },
];
