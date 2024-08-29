import React, { ReactNode } from "react";
import TemplateProvider from "./TemplateContext";

const TemplateWrapper = ({ children }: { children: ReactNode }) => {
  return <TemplateProvider>{children}</TemplateProvider>;
};

export default TemplateWrapper;
