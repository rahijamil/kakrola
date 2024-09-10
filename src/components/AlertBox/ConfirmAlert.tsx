import { Button } from "@/components/ui/button";
import React, { ReactNode } from "react";
import Spinner from "../ui/Spinner";

const ConfirmAlert = ({
  onCancel,
  onConfirm,
  title,
  description,
  submitBtnText,
  loading,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  description: ReactNode;
  submitBtnText: string;
  loading?: boolean;
}) => {
  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 bg-black/50 flex items-start pt-40 justify-center z-30"
      onClick={onCancel}
    >
      <div
        className="bg-surface rounded-lg p-4 space-y-5 w-11/12 max-w-[450px] whitespace-normal"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className={`space-y-1 ${!title && "pt-2"}`}>
          {title && <h2 className="font-bold text-base">{title}</h2>}
          <p className="text-text-600 text-[13px]">{description}</p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button size="xs" variant="gray" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="xs" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Spinner color="white" />
                {submitBtnText}
              </div>
            ) : (
              submitBtnText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAlert;
