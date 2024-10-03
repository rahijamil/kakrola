import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Check, CheckCircle, ChevronDown, Rocket } from "lucide-react";
import { PricingPlanForSettings } from "./pricing.types";
import { usePathname } from "next/navigation";
import {
  SubscriptionDetailResponse,
  TransactionResponse,
} from "@/lib/api.types";
import { getSubscription } from "@/utils/paddle/get-subscription";
import { getTransactions } from "@/utils/paddle/get-transactions";
import BillingSettings from "./BillingSettings";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useQuery } from "@tanstack/react-query";

const pricingPlans: PricingPlanForSettings[] = [
  {
    id: "free",
    name: "Free",
    price: (isAnnual: boolean) => "$0",
    price1: <>$0 per member / month</>,
    description: "For individuals getting started",
    features: [
      "Up to 5 active projects",
      "Basic task management",
      "100MB file storage",
      "3 team members",
      "Basic integrations",
      "2-factor authentication",
    ],
    highlighted: false,
    priceId: {
      month: "",
      year: "",
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: (isAnnual: boolean) => (isAnnual ? "$10" : "$12"),
    price1: (
      <>
        $10 per member / month <br /> billed annually
      </>
    ),
    price2: "$12 billed monthly",
    description: "For power users and small teams",
    features: [
      "Unlimited active projects",
      "Advanced task management",
      "5GB file storage per member",
      "Unlimited team members",
      "Advanced integrations",
      "Priority support",
      "Custom fields",
      "Gantt charts",
      "Time tracking",
    ],
    cta: "Upgrade",
    highlighted: true,
    badge: "Popular",
    priceId: {
      month: "pri_01j8wqm8x8w7gnmbax9wdeqpjf",
      year: "pri_01j8wqntqppsyw4ce6z65yc9ry",
    },
  },
  {
    id: "business",
    name: "Business",
    price: (isAnnual: boolean) => (isAnnual ? "$15" : "$18"),
    price1: (
      <>
        $15 per member / month <br /> billed annually
      </>
    ),
    price2: "$18 billed monthly",
    description: "For organizations that need more control and support",
    features: [
      "Everything in Pro",
      "Unlimited file storage",
      "Advanced security features",
      "Admin & owner roles",
      "Team billing",
      "Custom workflows",
      "Workload management",
      "24/7 customer support",
      "SSO (SAML)",
    ],
    cta: "Upgrade",
    businessHighlight: true,
    priceId: {
      month: "pri_01j8wqqssqgy137net5xa76djm",
      year: "pri_01j8wqrmqq2s336f4ehjwpxzqj",
    },
  },
];

const comparisonFeatures = [
  {
    category: "Core Features",
    features: [
      {
        name: "Projects",
        free: "Up to 5",
        pro: "Unlimited",
        business: "Unlimited",
      },
      {
        name: "Team members",
        free: "Up to 3",
        pro: "Unlimited",
        business: "Unlimited",
      },
      {
        name: "File storage",
        free: "100MB",
        pro: "5GB per user",
        business: "Unlimited",
      },
      {
        name: "Task management",
        free: "Basic",
        pro: "Advanced",
        business: "Advanced",
      },
      { name: "Views (List, Board)", free: true, pro: true, business: true },
      { name: "Mobile app access", free: true, pro: true, business: true },
    ],
  },
  {
    category: "Advanced Features",
    features: [
      { name: "Custom fields", free: false, pro: true, business: true },
      { name: "Gantt charts", free: false, pro: true, business: true },
      { name: "Timeline view", free: false, pro: true, business: true },
      { name: "Calendar view", free: false, pro: true, business: true },
      { name: "Time tracking", free: false, pro: true, business: true },
      {
        name: "Workflow automation",
        free: false,
        pro: "Basic",
        business: "Advanced",
      },
      {
        name: "Reporting and dashboards",
        free: false,
        pro: "Basic",
        business: "Advanced",
      },
    ],
  },
  {
    category: "Collaboration",
    features: [
      {
        name: "Task comments",
        free: "Basic",
        pro: "Advanced",
        business: "Advanced",
      },
      { name: "File sharing", free: true, pro: true, business: true },
      { name: "Team channels", free: false, pro: true, business: true },
      { name: "Guest access", free: false, pro: true, business: true },
      {
        name: "Proofing and approvals",
        free: false,
        pro: false,
        business: true,
      },
    ],
  },
  {
    category: "Customization & Integration",
    features: [
      { name: "Templates", free: "Basic", pro: "Custom", business: "Advanced" },
      {
        name: "Integrations",
        free: "Basic",
        pro: "Advanced",
        business: "Enterprise-grade",
      },
      { name: "API access", free: false, pro: false, business: true },
      { name: "Custom branding", free: false, pro: false, business: true },
    ],
  },
  {
    category: "Security & Administration",
    features: [
      {
        name: "Two-factor authentication",
        free: true,
        pro: true,
        business: true,
      },
      { name: "SSO (SAML)", free: false, pro: false, business: true },
      { name: "Advanced permissions", free: false, pro: true, business: true },
      {
        name: "User provisioning (SCIM)",
        free: false,
        pro: false,
        business: true,
      },
      {
        name: "Data encryption at rest",
        free: false,
        pro: false,
        business: true,
      },
    ],
  },
  {
    category: "Support",
    features: [
      {
        name: "Customer support",
        free: "Email",
        pro: "Priority email",
        business: "24/7 priority",
      },
      {
        name: "Dedicated success manager",
        free: false,
        pro: false,
        business: true,
      },
    ],
  },
];

const renderFeatureValue = (value: boolean | string) => {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 mx-auto" />
    ) : (
      <>{/* <X className="h-5 w-5 mx-auto" /> */}</>
    );
  }
  return value;
};

const SubscriptionSettings = ({
  setSelectedPlan,
  isShowBilling,
  subscriptionId,
}: {
  setSelectedPlan: Dispatch<SetStateAction<PricingPlanForSettings | null>>;
  isShowBilling: boolean;
  subscriptionId: string | null;
}) => {
  const [showComparison, setShowComparison] = useState(false);
  const pathname = usePathname();

  const { data: subscription, isLoading: isSubscriptionLoading } = useQuery({
    queryKey: ["subscription", subscriptionId],
    queryFn: () => getSubscription(subscriptionId!),
    enabled: !!subscriptionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const { data: transactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ["transactions", subscriptionId],
    queryFn: () => getTransactions(subscriptionId!, ""),
    enabled: !!subscriptionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const product = subscription?.data?.items[0].product;
  const activeSubscription = subscription?.data;

  const loading = isSubscriptionLoading;

  if (isShowBilling && subscription && transactions) {
    return (
      <BillingSettings
        subscription={subscription}
        transactions={transactions}
      />
    );
  } else {
    return (
      <>
        <main className="space-y-6">
          <div className="space-y-4">
            <h2 className="font-semibold text-base">Active plan</h2>

            <div
              className={`flex gap-4 border border-l-4 p-4 rounded-lg ${
                pricingPlans.find(
                  (item) => item.id === product?.name.toLowerCase()
                )?.businessHighlight
                  ? "border-text-500 bg-text-10 dark:border-text-500 dark:bg-surface"
                  : pricingPlans.find(
                      (item) =>
                        item.id ===
                        activeSubscription?.items[0].product.name.toLowerCase()
                    )?.highlighted
                  ? "border-kakrola-500 bg-kakrola-10 dark:border-[#8698c2] dark:bg-[#8698c2]/10"
                  : "border-text-100 bg-background"
              }`}
            >
              {/* <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                pricingPlans.find(
                  (item) => item.id === product?.name.toLowerCase()
                )?.businessHighlight
                  ? "bg-text-500"
                  : pricingPlans.find(
                      (item) =>
                        item.id === product?.name.toLowerCase()
                    )?.highlighted
                  ? "bg-kakrola-500 dark:bg-[#8698c2]/10"
                  : "bg-text-10"
              }`}
            >
              <Rocket
                className={`w-5 h-5 ${
                  pricingPlans.find(
                    (item) => item.id === product?.name.toLowerCase()
                  )?.highlighted ||
                  pricingPlans.find(
                    (item) => item.id === product?.name.toLowerCase()
                  )?.businessHighlight
                    ? "text-white"
                    : "text-background"
                }`}
                strokeWidth={1.5}
              />
            </div> */}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-4">
                  {loading ? (
                    <Skeleton width={150} borderRadius={8} height={20} />
                  ) : (
                    <h3 className="text-lg font-semibold text-text-900">
                      {product?.name}
                    </h3>
                  )}

                  {loading ? (
                    <Skeleton width={100} borderRadius={8} />
                  ) : (
                    <button
                      className="text-xs text-text-500 hover:text-text-700 transition"
                      onClick={() => {
                        window.history.pushState(
                          {},
                          "",
                          `${pathname}?settings=subscription&tab=billing`
                        );
                      }}
                    >
                      View billing
                    </button>
                  )}
                </div>
                {loading ? (
                  <Skeleton width={300} borderRadius={8} className="mt-2" />
                ) : (
                  <p className="text-text-500">{product?.description}</p>
                )}

                {/* <p className="mt-4 flex flex-col">
                <span className="text-xs font-medium text-text-600">
                  {
                    pricingPlans.find(
                      (item) =>
                        item.id === product?.name.toLowerCase()
                    )?.price1
                  }
                </span>
                {pricingPlans.find(
                  (item) => item.id === product?.name.toLowerCase()
                )?.price2 && (
                  <span className="text-xs font-medium text-text-600 opacity-70">
                    {
                      pricingPlans.find(
                        (item) =>
                          item.id === product?.name.toLowerCase()
                      )?.price2
                    }
                  </span>
                )}
              </p> */}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-b border-text-100 pb-4">
              <h2 className="font-semibold text-base">All plans</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`rounded-lg overflow-hidden border border-t-5 bg-background p-6 space-y-6 flex flex-col ${
                    plan.businessHighlight
                      ? "border-text-500 dark:border-text-500"
                      : plan.highlighted
                      ? "border-kakrola-500 dark:border-[#8698c2]"
                      : "border-text-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-text-900">
                      {plan.name}
                    </h2>

                    {plan.badge && (
                      <span className="bg-kakrola-500 text-surface text-xs font-semibold px-2 py-1 rounded-lg dark:bg-[#8698c2]">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="mt-4 flex flex-col">
                    <span className="text-xs font-medium text-text-600">
                      {plan.price1}
                    </span>
                    <span className="text-xs font-medium text-text-600 opacity-70">
                      {plan.price2}
                    </span>
                  </p>

                  {plan.cta ? (
                    <div>
                      <Button
                        variant={plan.highlighted ? "default" : "outline"}
                        color={
                          plan.highlighted
                            ? "kakrola"
                            : plan.businessHighlight
                            ? "text"
                            : "primary"
                        }
                        fullWidth
                        onClick={() => setSelectedPlan(plan)}
                      >
                        {(plan.highlighted || plan.businessHighlight) && (
                          <Rocket className="w-5 h-5" strokeWidth={1.5} />
                        )}
                        {plan.cta}
                      </Button>
                    </div>
                  ) : (
                    <div className="h-[75px]"></div>
                  )}

                  <ul className="space-y-2 flex-1">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                          <CheckCircle
                            className="h-4 w-4 text-text-500"
                            strokeWidth={1.5}
                          />
                        </div>
                        <p className="ml-3 text-text-700">{feature}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Section */}
          <section className="pt-2 pb-6 hidden md:block">
            {showComparison ? (
              <div className="border-b border-text-100 pb-4 mb-6">
                <h2 className="font-semibold text-base">Plans and features</h2>
              </div>
            ) : (
              <div className="border-b border-text-100 pb-4 mb-6 flex items-center justify-center">
                <Button
                  onClick={() => setShowComparison(true)}
                  variant="ghost"
                  size="sm"
                >
                  Compare plans
                  <ChevronDown className="w-5 h-5" strokeWidth={1.5} />
                </Button>
              </div>
            )}

            {showComparison && (
              <div className="bg-background overflow-x-auto">
                {comparisonFeatures.map(
                  (category, categoryIndex, categoryArray) => (
                    <div key={categoryIndex}>
                      <div className="flex items-center gap-6 relative">
                        <div className="absolute h-px w-full bottom-0 bg-black/5 dark:bg-white/5"></div>

                        <div
                          className={`px-4 py-2 font-medium text-xs text-text-500 w-1/4 ${
                            categoryIndex !== 0 && "h-14 flex items-end"
                          }`}
                        >
                          {category.category}
                        </div>

                        {pricingPlans.map((plan, index) =>
                          categoryIndex == 0 ? (
                            <div
                              key={index}
                              className={`px-6 py-3 text-center text-xs font-medium text-text-700 uppercase tracking-wider w-1/4 rounded-t-lg border border-b-0 border-t-5 h-20 md:h-14 ${
                                plan.businessHighlight
                                  ? "border-text-500 bg-text-10 dark:border-text-500 dark:bg-surface"
                                  : plan.highlighted
                                  ? "border-kakrola-500 bg-kakrola-10 dark:border-[#8698c2] dark:bg-[#8698c2]/10"
                                  : "border-text-100 bg-background"
                              }`}
                            >
                              {plan.name}
                            </div>
                          ) : (
                            <div
                              key={index}
                              className={`px-6 py-3 text-center text-xs font-medium text-text-700 uppercase tracking-wider w-1/4 border-x h-14 ${
                                plan.businessHighlight
                                  ? "border-text-500 bg-text-10 dark:border-text-500 dark:bg-surface"
                                  : plan.highlighted
                                  ? "border-kakrola-500 bg-kakrola-10 dark:border-[#8698c2] dark:bg-[#8698c2]/10"
                                  : "border-text-100 bg-background"
                              }`}
                            ></div>
                          )
                        )}
                      </div>

                      {category.features.map((feature, featureIndex, self) =>
                        categoryIndex == categoryArray.length - 1 &&
                        featureIndex == self.length - 1 ? (
                          <div key={featureIndex}>
                            <div
                              key={featureIndex}
                              className={`flex w-full gap-6 relative group ${
                                self.length - 1 === featureIndex ? "" : ""
                              }`}
                            >
                              <div className="px-4 py-2 text-xs font-medium text-text-900 w-[calc(25%-2px)]">
                                {feature.name}
                              </div>
                              <div className="px-4 py-2 text-xs font-medium text-text-500 text-center w-1/4 border-x border-text-100 bg-background">
                                {renderFeatureValue(feature.free)}
                              </div>
                              <div className="px-4 py-2 text-xs font-medium text-text-500 text-center w-1/4 border-x border-kakrola-500 bg-kakrola-10 dark:border-[#8698c2] dark:bg-[#8698c2]/10">
                                {renderFeatureValue(feature.pro)}
                              </div>
                              <div className="px-4 py-2 text-xs font-medium text-text-500 text-center w-1/4 border-x border-text-500 bg-text-10 dark:border-text-500 dark:bg-surface">
                                {renderFeatureValue(feature.business)}
                              </div>

                              <div className="absolute group-hover:bg-black/5 dark:group-hover:bg-white/5 rounded-lg transition w-full h-full"></div>
                            </div>

                            <div
                              className={`flex w-full gap-6 relative ${
                                self.length - 1 === featureIndex ? "" : ""
                              }`}
                            >
                              <div className="absolute h-px w-full top-0 bg-black/5 dark:bg-white/5"></div>

                              <div className="px-4 py-2 text-xs font-medium text-text-900 w-[calc(25%-2px)]">
                                {/* {feature.name} */}
                              </div>
                              <div className="px-4 py-2 text-xs font-medium text-text-500 text-center w-1/4 border border-t-0 border-text-100 bg-background rounded-b-lg">
                                <div
                                  className={`text-center font-semibold text-text-700 uppercase tracking-widerbg-background pb-4`}
                                >
                                  Free
                                </div>
                              </div>
                              <div className="px-4 py-2 text-xs font-medium text-text-500 text-center w-1/4 border border-t-0 border-kakrola-500 bg-kakrola-10 dark:border-[#8698c2] dark:bg-[#8698c2]/10 rounded-b-lg">
                                <div
                                  className={`text-center font-semibold text-text-700 uppercase tracking-widerbg-background pb-4`}
                                >
                                  Pro
                                </div>

                                <Link href="/auth/signup">
                                  <Button fullWidth color="kakrola">
                                    <Rocket
                                      className="w-5 h-5"
                                      strokeWidth={1.5}
                                    />
                                    Upgrade
                                  </Button>
                                </Link>
                              </div>
                              <div className="px-4 py-2 text-xs font-medium text-text-500 text-center w-1/4 border border-t-0 border-text-500 bg-text-10 dark:border-text-500 dark:bg-surface rounded-b-lg">
                                <div
                                  className={`text-center font-semibold text-text-700 uppercase tracking-widerbg-background pb-4`}
                                >
                                  Business
                                </div>

                                <Link href="/auth/signup">
                                  <Button
                                    fullWidth
                                    variant="outline"
                                    color="text"
                                  >
                                    <Rocket
                                      className="w-5 h-5"
                                      strokeWidth={1.5}
                                    />
                                    Upgrade
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={featureIndex}
                            className={`flex w-full gap-6 relative group ${
                              self.length - 1 === featureIndex ? "" : ""
                            }`}
                          >
                            <div className="px-4 py-2 text-xs font-medium text-text-700 w-[calc(25%-2px)]">
                              {feature.name}
                            </div>
                            <div className="px-4 py-2 text-xs font-medium text-text-700 text-center w-1/4 border-x border-text-100 bg-background">
                              {renderFeatureValue(feature.free)}
                            </div>
                            <div className="px-4 py-2 text-xs font-medium text-text-700 text-center w-1/4 border-x border-kakrola-500 bg-kakrola-10 dark:border-[#8698c2] dark:bg-[#8698c2]/10">
                              {renderFeatureValue(feature.pro)}
                            </div>
                            <div className="px-4 py-2 text-xs font-medium text-text-700 text-center w-1/4 border-x border-text-500 bg-text-10 dark:border-text-500 dark:bg-surface">
                              {renderFeatureValue(feature.business)}
                            </div>

                            <div className="absolute group-hover:bg-black/5 dark:group-hover:bg-white/5 rounded-lg transition w-full h-full"></div>
                          </div>
                        )
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        </main>
      </>
    );
  }
};

export default SubscriptionSettings;
