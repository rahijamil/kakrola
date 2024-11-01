import { Button } from "@/components/ui/button";
import React, { ReactNode, memo, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog";

interface ConfirmAlertProps {
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  description: ReactNode;
  submitBtnText: string;
  loading?: boolean;
}

// Memoized loading button content
const LoadingButtonContent = memo(({ text }: { text: string }) => (
  <div className="flex items-center gap-2">
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    {text}
  </div>
));

LoadingButtonContent.displayName = "LoadingButtonContent";

const ConfirmAlert = memo(
  ({
    onCancel,
    onConfirm,
    title,
    description,
    submitBtnText,
    loading,
  }: ConfirmAlertProps) => {
    // Memoize handlers to prevent unnecessary re-renders
    const handleConfirm = useCallback(() => {
      if (!loading) {
        onConfirm();
      }
    }, [loading, onConfirm]);

    const handleCancel = useCallback(() => {
      if (!loading) {
        onCancel();
      }
    }, [loading, onCancel]);

    return (
      <AlertDialog open onOpenChange={handleCancel}>
        <AlertDialogOverlay onClick={handleCancel}>
          <AlertDialogContent
            className="border-l-4 border-primary-200 p-4 bg-white dark:bg-gray-800 rounded-lg space-y-5 w-11/12 max-w-[450px] mx-auto transform-gpu top-80"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className={`space-y-1 ${!title ? "pt-2" : ""}`}>
              {title && <h2 className="font-bold text-base">{title}</h2>}
              <p className="text-gray-600 dark:text-gray-300 text-[13px]">
                {description}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                disabled={loading}
                className="text-gray-600 hover:text-gray-800"
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={loading}
                variant="ghost"
                className="text-primary-600 hover:text-primary-800"
              >
                {loading ? (
                  <LoadingButtonContent text={submitBtnText} />
                ) : (
                  submitBtnText
                )}
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    );
  }
);

ConfirmAlert.displayName = "ConfirmAlert";

export default ConfirmAlert;
