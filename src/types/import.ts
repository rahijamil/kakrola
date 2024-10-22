// types/import.ts

// Base configuration for any import source
export interface ImportSource {
  id: string; // Unique identifier for the source
  name: string; // Display name
  type: ImportSourceType; // Type of import source
  description: string; // Brief description
  icon: React.ReactNode; // Icon component
  supported_formats?: string[]; // For file imports
}

// Different types of import sources
export enum ImportSourceType {
  PLATFORM = "platform", // Other platforms like Notion, Trello
  FILES = "files", // File imports like CSV, Text
  PASTE = "paste", // Direct paste imports
}

// Configuration for platform-specific imports
export interface PlatformSource extends ImportSource {
  type: ImportSourceType.PLATFORM;
  auth_url: (currentPathname: string) => string; // OAuth URL if required
  api_base?: string; // Base API URL
  scopes?: string[]; // Required OAuth scopes
}

// Configuration for file imports
export interface FileSource extends ImportSource {
  type: ImportSourceType.FILES;
  accepted_extensions: string[];
  max_size_mb: number;
}

// Configuration for paste imports
export interface PasteSource extends ImportSource {
  type: ImportSourceType.PASTE;
  template?: string; // Optional template for paste format
}

// Union type for all import sources
export type AnyImportSource = PlatformSource | FileSource | PasteSource;

// Common structure for imported data
export interface ImportedData {
  title: string;
  description?: string;
  items: ImportedItem[];
  metadata?: Record<string, any>;
}

export interface ImportedItem {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  status?: string;
  labels?: string[];
  assignees?: string[];
  attachments?: string[];
  metadata?: Record<string, any>;
}

// Import result with status
export interface ImportResult {
  success: boolean;
  data?: ImportedData;
  error?: string;
  warnings?: string[];
  stats?: {
    total_items: number;
    imported_items: number;
    skipped_items: number;
  };
}
