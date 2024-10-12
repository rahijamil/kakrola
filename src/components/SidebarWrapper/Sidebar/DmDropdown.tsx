import DmSidebar from "@/app/app/dms/DmSidebar";
import useDms from "@/app/app/dms/useDms";
import Dropdown from "@/components/ui/Dropdown";
import { DmContactType } from "@/types/channel";
import { LucideProps } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const DmDropdown = ({
  item,
}: {
  item: {
    id: number;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    text: string;
    path?: string;
    onClick?: () => void;
  };
}) => {
  const [isDmOpen, setDmOpen] = useState(false);
  const dmTriggerRef = useRef(null);

  const pathname = usePathname();

  // const {
  //   contacts: initialContacts,
  //   isLoadingContacts,
  //   getDmsForContact,
  //   loadMore,
  //   limit,
  // } = useDms();

  // const [contacts, setContacts] = useState<DmContactType[]>(initialContacts);
  // const [activeContact, setActiveContact] = useState<DmContactType | null>(
  //   null
  // );

  // useEffect(() => {
  //   setContacts(initialContacts);
  // }, [initialContacts]);

  return (
    <Dropdown
      title="Direct Messages"
      isOpen={isDmOpen}
      setIsOpen={setDmOpen}
      triggerRef={dmTriggerRef}
      Label={() => (
        <Link
          ref={dmTriggerRef}
          href={item.path!}
          // onMouseOver={() => setDmOpen(true)}
          className={`flex items-center p-2 px-4 transition-colors duration-150 font-medium md:font-normal w-full border-l-4 ${
            item.path === pathname
              ? "bg-primary-100 text-text-900 border-primary-300"
              : "md:hover:bg-primary-50 border-transparent hover:border-primary-200 text-text-700"
          }`}
        >
          <item.icon
            strokeWidth={1.5}
            className="w-5 h-5 mr-3 text-primary-500"
          />
          {item.text}
        </Link>
      )}
      // content={
      //   <DmSidebar
      //     activeContact={activeContact}
      //     setActiveContact={setActiveContact}
      //     dmContacts={contacts}
      //     isLoadingContacts={isLoadingContacts}
      //     forDropdown
      //   />
      // }
      // contentWidthClass="w-80"
    />
  );
};

export default DmDropdown;
