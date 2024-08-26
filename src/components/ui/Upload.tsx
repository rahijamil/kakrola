import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon, LucideProps } from "lucide-react";
import Image from "next/image";

interface UploadProps {
  id: string;
  className?: string;
  children: React.ReactNode;
  Icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  accept?: string;
  onChange?: (file: File | null) => void;
}

export const Upload: React.FC<UploadProps> = ({
  id,
  className = "",
  children,
  Icon,
  accept,
  onChange,
}) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setFileUrl(URL.createObjectURL(file));
      onChange?.(file);
    } else {
      setFileUrl(null);
      onChange?.(null);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        className="sr-only"
        onChange={handleFileChange}
        accept={accept}
      />
      <button
        type="button"
        className="flex items-center h-10 border border-text-300 hover:border-text-400 focus:border-text-300 px-3 rounded-lg gap-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-300 ring-offset-2"
        onClick={handleClick}
      >
        {fileUrl ? (
          <Image
            src={fileUrl}
            alt="Uploaded image"
            width={20}
            height={20}
            className="rounded-lg overflow-hidden bg-text-100"
            objectFit="cover"
          />
        ) : (
          Icon && <Icon size={20} strokeWidth={1.5} className="text-text-600" />
        )}
        {fileUrl ? "Looking good!" : children}
      </button>
    </div>
  );
};
