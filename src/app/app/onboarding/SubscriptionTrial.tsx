import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import OnboardWrapper from "./OnboardWrapper";
import FreeTrialComponent from "@/components/settings/checkout/FreeTrialComponent";
import { pricingTiers } from "@/lib/constants/pricing-tier";

const SubscriptionTrial = ({
  gettingStartedPageSlug,
}: {
  gettingStartedPageSlug: string | null;
}) => {
  const { profile } = useAuthProvider();

  const router = useRouter();

  useEffect(() => {
    const finishOnboarding = async () => {
      try {
        if (!profile?.id) throw new Error("Profile not found");

        if (!profile.is_onboarded) {
          const { data, error } = await supabaseBrowser
            .from("profiles")
            .update({ is_onboarded: true })
            .eq("id", profile.id);

          if (error) throw error;

          router.push("/app");
        }
      } catch (error) {
        console.error(error);
      }
    };

    finishOnboarding();
  }, []);

  return (
    <OnboardWrapper size="md">
      <FreeTrialComponent
        selectedPlan={pricingTiers[0]}
        hideDetails
        successUrl={
          gettingStartedPageSlug
            ? "/app/page/" + gettingStartedPageSlug
            : undefined
        }
      />
    </OnboardWrapper>
  );
};

export default SubscriptionTrial;
