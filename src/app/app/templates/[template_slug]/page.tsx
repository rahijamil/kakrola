import React from "react";

const TemplateDetails = ({
  params: { template_slug },
}: {
  params: { template_slug: string };
}) => {
  return <div>TemplateDetails: {template_slug}</div>;
};

export default TemplateDetails;
