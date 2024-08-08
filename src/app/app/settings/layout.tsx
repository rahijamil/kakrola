import SettingsModal from "@/components/SettingsModal";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SettingsModal>{children}</SettingsModal>;
}
