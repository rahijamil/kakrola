// components/Hcaptcha.jsx
import React from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const Hcaptcha = ({
  onVerify,
  ref,
}: {
  onVerify: (token: string) => void;
  ref: React.MutableRefObject<HCaptcha | null>
}) => {
  const handleVerification = (token: string) => {
    onVerify(token);
  };

  return (
    <HCaptcha
      ref={ref}
      sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
      onVerify={handleVerification}
    />
  );
};

export default Hcaptcha;
