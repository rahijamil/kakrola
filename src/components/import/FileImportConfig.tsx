// components/import/FileImportConfig.tsx
import { useCallback } from "react";
import { FileSource } from "@/types/import";
import { useDropzone } from "react-dropzone";
import { parseCSV } from "@/lib/utils";

interface FileImportConfigProps {
  source: FileSource;
  onData: (data: any) => void;
}

export default function FileImportConfig({
  source,
  onData,
}: FileImportConfigProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          let parsedData;
          if (source.id === "csv") {
            // Parse CSV data
            parsedData = await parseCSV(reader.result as string);
          } else {
            // Parse as text
            parsedData = reader.result;
          }
          onData(parsedData);
        } catch (error) {
          console.error("Error parsing file:", error);
        }
      };

      reader.readAsText(file);
    },
    [source, onData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "text/plain": [".txt"],
    },
    maxSize: source.max_size_mb * 1024 * 1024,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${
          isDragActive ? "border-primary-500 bg-primary-50" : "border-gray-300"
        }`}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <p className="text-lg font-medium">
          {isDragActive ? "Drop the file here" : "Drag & drop your file here"}
        </p>
        <p className="text-sm text-gray-500">or click to select a file</p>
        <p className="text-xs text-gray-400">
          Supported formats: {source.accepted_extensions.join(", ")} (Max:{" "}
          {source.max_size_mb}MB)
        </p>
      </div>
    </div>
  );
}
