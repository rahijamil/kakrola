import React, { ReactNode } from "react";
import TemplateWrapper from "./TemplateWrapper";

const TemplateLayout = ({ children }: { children: ReactNode }) => {
  return <TemplateWrapper>{children}</TemplateWrapper>;
};

export default TemplateLayout;
