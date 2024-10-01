import { useState, useCallback } from "react";
import { toast as sonnerToast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  type?: ToastType;
  duration?: number;
}

export function useToast() {
  const [isVisible, setIsVisible] = useState(false);

  const toast = useCallback(
    (message: string | React.ReactNode, options: ToastOptions = {}) => {
      const { type = "info", duration = 3000 } = options;

      setIsVisible(true);

      sonnerToast[type](message, {
        duration,
        onDismiss: () => setIsVisible(false),
      });
    },
    []
  );

  return { toast, isVisible };
}
