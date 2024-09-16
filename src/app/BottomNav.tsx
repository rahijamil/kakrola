import { Home, LogIn, LucideProps, Rocket } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import KakrolaLogo from "./kakrolaLogo";
import { useAuthProvider } from "@/context/AuthContext";

const menuItems: {
  id: number;
  icon: ReactNode;
  text: string;
  path: string;
}[] = [
  {
    id: 1,
    icon: <Home strokeWidth={1.5} className={`w-5 h-5`} />,
    text: "Home",
    path: "/",
  },
  {
    id: 2,
    icon: <Rocket strokeWidth={1.5} className={`w-5 h-5`} />,
    text: "Start Your Journey",
    path: "/auth/signup",
  },
  {
    id: 3,
    icon: <LogIn strokeWidth={1.5} className={`w-5 h-5`} />,
    text: "Log In",
    path: "/auth/login",
  },
];

const authItems: {
  id: number;
  icon: ReactNode;
  text: string;
  path: string;
}[] = [
  {
    id: 1,
    icon: <Home strokeWidth={1.5} className={`w-5 h-5`} />,
    text: "Home",
    path: "/",
  },
  {
    id: 2,
    icon: <KakrolaLogo size="xs" />,
    text: "Open Kakrola",
    path: "/app",
  },
  {
    id: 3,
    icon: <LogIn strokeWidth={1.5} className={`w-5 h-5`} />,
    text: "Upgrade to Pro",
    path: "/app/pricing",
  },
];

const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { profile } = useAuthProvider();

  return (
    <aside className="group bg-primary-10 fixed bottom-0 left-0 right-0 z-20 border-t border-primary-50 select-none">
      <nav>
        <ul className="grid grid-cols-3 p-4 px-2 pt-1 place-items-center">
          {(profile ? authItems : menuItems).map((item) => (
            <li key={item.id}>
              <button
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center space-y-0.5 transition ${
                  item.path == pathname ? "text-text-900" : "text-text-900"
                }`}
                onTouchStart={(ev) => {
                  ev.currentTarget.classList.add("scale-95");
                }}
                onTouchEnd={(ev) => {
                  ev.currentTarget.classList.remove("scale-95");
                }}
              >
                <div
                  className={`rounded-lg transition ${
                    item.path === pathname && "bg-primary-100"
                  } p-1 px-5`}
                >
                  {item.icon}
                </div>
                <span className="text-xs font-medium">{item.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default BottomNav;
