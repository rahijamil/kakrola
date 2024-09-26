import { Button } from "@/components/ui/button";
import React, { ReactNode } from "react";
import Spinner from "../ui/Spinner";
import { AnimatePresence, motion } from "framer-motion";

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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed inset-0 z-50 bg-black bg-opacity-50 pt-40"
        onClick={onCancel}
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 0.8,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="bg-surface rounded-lg p-4 space-y-5 w-11/12 max-w-[450px] whitespace-normal mx-auto"
          onClick={(ev) => ev.stopPropagation()}
        >
          <div className={`space-y-1 ${!title && "pt-2"}`}>
            {title && <h2 className="font-bold text-base">{title}</h2>}
            <p className="text-text-600 text-[13px]">{description}</p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button size="xs" variant="ghost" color="gray" onClick={onCancel}>
              Cancel
            </Button>
            <Button size="xs" onClick={onConfirm} disabled={loading} variant="ghost">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner color="current" size="sm" />
                  {submitBtnText}
                </div>
              ) : (
                submitBtnText
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmAlert;
