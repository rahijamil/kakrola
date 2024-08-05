import { Button } from "@/app/LandingPageButton";
import React, { ReactNode } from "react";

const ConfirmAlert = ({
  onCancel,
  onSubmit,
  title,
  description,
  submitBtnText,
}: {
  onCancel: () => void;
  onSubmit: () => void;
  title: string;
  description: ReactNode;
  submitBtnText: string;
}) => {
  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 bg-black/50 flex items-start pt-40 justify-center z-30"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-md p-4 space-y-4 w-[420px] whitespace-normal"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="space-y-1">
          <h2 className="font-bold text-base">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Button size="xs" variant="gray" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="xs" variant="danger" onClick={onSubmit}>
            {submitBtnText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAlert;
