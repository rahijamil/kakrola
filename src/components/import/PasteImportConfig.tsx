// components/import/PasteImportConfig.tsx
import { useState } from "react";
import { PasteSource } from "@/types/import";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";

interface PasteImportConfigProps {
  source: PasteSource;
  onData: (data: any) => void;
}

export default function PasteImportConfig({
  source,
  onData,
}: PasteImportConfigProps) {
  const [content, setContent] = useState(source.template || "");

  const handlePaste = () => {
    try {
      // Parse the pasted content
      const parsedData = {
        text: content,
        items: content
          .split("\n")
          .filter(Boolean)
          .map((line, index) => ({
            id: `item-${index}`,
            title: line.replace(/^[-*]\s*/, ""),
          })),
      };
      onData(parsedData);
    } catch (error) {
      console.error("Error parsing pasted content:", error);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste your content here..."
        className="min-h-[200px]"
      />
      <div className="flex justify-end">
        <Button onClick={handlePaste}>Process Content</Button>
      </div>
    </div>
  );
}
