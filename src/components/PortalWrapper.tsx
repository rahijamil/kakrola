import React, { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const PortalWrapper = ({ children }: { children: ReactNode }) => {
  const [portalWrapper, setPortalWrapper] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (document.body) {
      setPortalWrapper(document.body);
    }
  }, []);

  return portalWrapper && createPortal(children, portalWrapper);
};

export default PortalWrapper;
