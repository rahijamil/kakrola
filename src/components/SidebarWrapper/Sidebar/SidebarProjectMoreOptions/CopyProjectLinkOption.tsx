import { Link } from "lucide-react";
import React from "react";

const CopyProjectLinkOption = ({
  onClose,
  project_slug,
}: {
  onClose: () => void;
  project_slug: string;
}) => {
  const handleCopyProjectLink = () => {
    navigator.clipboard.writeText(`https://ekta.com/project/${project_slug}`);
    onClose();
  };

  return (
    <button
      onClick={handleCopyProjectLink}
      className="w-full text-left px-4 py-2 text-sm text-text-700 hover:bg-text-100 transition flex items-center"
    >
      <Link strokeWidth={1.5} className="w-4 h-4 mr-2" /> Copy project link
    </button>
  );
};

export default CopyProjectLinkOption;