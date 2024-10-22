"use client";

import {
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Dialog, RadioGroup, RadioGroupItem, Label } from "../ui";
import {
  AlarmClock,
  ArrowDownToLine,
  ArrowLeft,
  BellIcon,
  Blocks,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  CloudUploadIcon,
  DollarSign,
  LucideProps,
  PaletteIcon,
  PanelLeft,
  Plus,
  Rocket,
  SettingsIcon,
  SlidersHorizontal,
  SquarePlusIcon,
  TargetIcon,
  UploadIcon,
  UserIcon,
  Users,
  WalletIcon,
  X,
} from "lucide-react";
import AddTeam from "../AddTeam";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";
import Image from "next/image";
import AccountSettings from "./AccountSettings";
import ThemeSettingsPage from "./ThemeSettings";
import { AnimatePresence } from "framer-motion";
import AddPassword from "./AddPassword";
import SubscriptionSettings from "./SubscriptionSettings";
import CheckoutSettings from "./checkout/CheckoutSettings";
import CheckoutSuccess from "./checkout/CheckoutSuccess";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import TeamspaceSettings from "./TeamspaceSettings";
import { Tier } from "@/lib/constants/pricing-tier";
import IntegrationsSettings from "./IntegrationsSettings";
import ImportSettings from "./ImportSettings";

const SettingsModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const settings = searchParams.get("settings");
  const teamIdParam = searchParams.get("teamId");
  const teamId = teamIdParam ? parseInt(teamIdParam, 10) : null;
  const tab = searchParams.get("tab");
  const { profile } = useAuthProvider();

  const { data: subscriptionData } = useQuery({
    queryKey: ["subscriptionId", profile?.id],
    queryFn: async () => {
      if (!profile) return null;

      const { data, error } = await supabaseBrowser
        .from("subscriptions")
        .select("subscription_id")
        .eq("customer_profile_id", profile.id)
        .single();

      if (error) throw error;
      return data?.subscription_id;
    },
    enabled: !!profile,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const subscriptionId = subscriptionData ?? null;

  const [selectedPlan, setSelectedPlan] = useState<Tier | null>(null);

  const closeSettings = useCallback(() => {
    window.history.pushState(null, "", pathname);
  }, [pathname]);

  const menuGroups: {
    id: number;
    name: "Account" | "Workspace";
    items: {
      id: number;
      name: string;
      param: string;
      icon: ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
      >;
    }[];
  }[] = [
    {
      id: 1,
      name: "Account",
      items: [
        {
          id: 1,
          name: "Account",
          param: "account",
          icon: UserIcon,
        },
        // {
        //   id: 2,
        //   name: "General",
        //   path: "/app/settings/general",
        //   icon: SettingsIcon,
        // },
        // {
        //   id: 3,
        //   name: "Advanched",
        //   path: "/app/settings/advanched",
        //   icon: SlidersHorizontal,
        // },
        // {
        //   id: 5,
        //   name: "Theme",
        //   param: "theme",
        //   icon: PaletteIcon,
        // },
        // {
        //   id: 6,
        //   name: "Sidebar",
        //   path: "/app/settings/sidebar",
        //   icon: PanelLeft,
        // },
        // {
        //   id: 7,
        //   name: "Quick Add",
        //   path: "/app/settings/quick-customization",
        //   icon: SquarePlusIcon,
        // },
        // {
        //   id: 8,
        //   name: "Productivity",
        //   path: "/app/settings/productivity",
        //   icon: TargetIcon,
        // },
        // {
        //   id: 9,
        //   name: "Reminders",
        //   path: "/app/settings/reminders",
        //   icon: AlarmClock,
        // },
        // {
        //   id: 10,
        //   name: "Notifications",
        //   param: "notifications",
        //   icon: BellIcon,
        // },
        // {
        //   id: 11,
        //   name: "Backup",
        //   path: "/app/settings/backup",
        //   icon: CloudUploadIcon,
        // },
        // {
        //   id: 12,
        //   name: "Integrations",
        //   param: "integrations",
        //   icon: Blocks,
        // },
        // {
        //   id: 13,
        //   name: "Calendars",
        //   path: "/app/settings/calendars",
        //   icon: CalendarDays,
        // },
      ],
    },
    {
      id: 2,
      name: "Workspace",
      items: [
        {
          id: 1,
          name: "Subscription",
          param: "subscription",
          icon: WalletIcon,
        },
        {
          id: 2,
          name: "Teamspaces",
          param: "teamspaces",
          icon: Building2,
        },
        // {
        //   id: 3,
        //   name: "Import",
        //   param: "import",
        //   icon: ArrowDownToLine,
        // },
      ],
    },
  ];

  const renderSettings = useMemo(() => {
    switch (settings) {
      case "account":
        return tab == "password" ? <AddPassword /> : <AccountSettings />;
      case "subscription":
        return (
          <SubscriptionSettings
            setSelectedPlan={setSelectedPlan}
            isShowBilling={tab === "billing"}
            subscriptionId={subscriptionId}
          />
        );
      // case "theme":
      //   return <ThemeSettingsPage />;
      case "notifications":
        return "<NotificationsSettings />";
      case "integrations":
        return <IntegrationsSettings />;
      case "teamspaces":
        return <TeamspaceSettings />;
      // case "import":
      //   return <ImportSettings />;
      default:
        return null;
    }
  }, [settings, tab]);

  const renderSettingsTitle = useMemo(() => {
    switch (settings) {
      case "account":
        return tab == "password" ? "Password" : "Account";
      case "subscription":
        return tab === "billing" ? "Billing" : "Subscription";
      // case "theme":
      //   return "Theme";
      case "notifications":
        return "Notifications";
      case "integrations":
        return "Integrations";
      case "teamspaces":
        return "Teamspaces settings";
      // case "import":
      //   return "Import data";
      default:
        return null;
    }
  }, [settings, tab]);

  if (!settings) {
    return null;
  }

  return (
    <AnimatePresence>
      <Dialog size="lg" onClose={closeSettings} hideCloseIcon>
        <div className="flex h-full rounded-lg overflow-hidden bg-gradient-to-br from-primary-10 via-background to-primary-50 text-text-700">
          <div
            className={`w-full md:w-64 flex flex-col divide-y divide-text-100 overflow-y-auto ${
              settings == "mobile" ? "bg-background pb-2" : "hidden md:block"
            }`}
          >
            <div className="flex-1 divide-y divide-text-100">
              {/* <div className="p-4 md:p-6 pb-3 h-[58px] flex items-center gap-4">
                <ChevronLeft
                  strokeWidth={1.5}
                  className="w-6 h-6 block md:hidden"
                  onClick={() => router.back()}
                />

                <h2 className="font-bold">Settings</h2>
              </div> */}

              <nav className="divide-y divide-text-100 pt-2">
                <div className="py-2 space-y-1">
                  <ul className="divide-y divide-text-100">
                    {menuGroups.map((group) => (
                      <li key={group.id} className="py-2 space-y-1">
                        <p
                          className={`font-medium text-xs transition duration-150 overflow-hidden whitespace-nowrap text-ellipsis px-5 pb-1 text-text-700`}
                        >
                          {group.name}
                        </p>

                        {group.items.length > 0 && (
                          <ul>
                            {group.items.map((item) => (
                              <li key={item.id}>
                                {item.param && (
                                  <button
                                    onClick={() =>
                                      window.history.pushState(
                                        null,
                                        "",
                                        `${pathname}?settings=${item.param}`
                                      )
                                    }
                                    className={`flex items-center p-2 px-4 transition-colors duration-150 font-medium md:font-normal w-full border-l-4 ${
                                      settings === item.param
                                        ? "bg-primary-100 text-text-900 border-primary-300"
                                        : "md:hover:bg-primary-50 border-transparent md:hover:border-primary-200 text-text-700 py-2.5 md:py-2"
                                    }`}
                                    onTouchStart={(ev) =>
                                      ev.currentTarget.classList.add(
                                        "bg-text-100"
                                      )
                                    }
                                    onTouchEnd={(ev) =>
                                      ev.currentTarget.classList.remove(
                                        "bg-text-100"
                                      )
                                    }
                                  >
                                    <item.icon
                                      strokeWidth={1.5}
                                      className="w-5 h-5 mr-3 text-primary-500"
                                    />
                                    {item.name}
                                  </button>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
            </div>
          </div>

          <div
            className={`flex-1 bg-background md:rounded-lg shadow-[1px_1px_.5rem_0_rgba(0,0,0,0.1)] md:border border-text-100 overflow-y-auto ${
              settings !== "mobile"
                ? "md:m-1.5 md:ml-0"
                : "hidden md:m-2 md:ml-0 md:block"
            }`}
          >
            <div className="p-4 md:p-6 border-b border-text-100 flex items-center gap-2 h-[54px]">
              {tab && !teamId && (
                <button
                  className="p-1 rounded-lg hover:bg-primary-50 transition"
                  onClick={() => router.back()}
                >
                  <ArrowLeft strokeWidth={1.5} size={20} />
                </button>
              )}
              <p className="font-semibold flex items-center gap-4">
                <ChevronLeft
                  strokeWidth={1.5}
                  className="w-6 h-6 block md:hidden"
                  onClick={() => router.back()}
                />

                {renderSettingsTitle}
              </p>
            </div>

            <div className="overflow-y-auto p-6">{renderSettings}</div>
          </div>
        </div>
      </Dialog>

      {tab !== "checkout-success" && selectedPlan && (
        <CheckoutSettings
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          tab={tab}
        />
      )}

      {tab === "checkout-success" && (
        <CheckoutSuccess setSelectedPlan={setSelectedPlan} />
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
