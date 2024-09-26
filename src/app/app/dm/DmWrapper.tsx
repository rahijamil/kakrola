import useScreen from "@/hooks/useScreen";
import { DmContactType } from "@/types/channel";
import { ChevronLeft, Headphones, MoreVertical, X } from "lucide-react";
import Image from "next/image";
import React from "react";

const DmWrapper = ({
  contact,
  children,
  setActiveContact,
}: {
  setActiveContact: (contact: DmContactType | null) => void;
  contact: DmContactType;
  children: React.ReactNode;
}) => {
  const { screenWidth } = useScreen();

  return (
    <div
      className={`flex flex-col h-full w-full flex-1 transition-all duration-300 contact-wrapper`}
    >
      <div
        className={`flex items-center justify-between gap-3 md:gap-4 border-b border-text-100 bg-background z-10 select-none h-[53px] ${
          screenWidth > 768 ? "py-3 px-6" : contact ? "px-3 py-1" : "p-3"
        }`}
      >
        {screenWidth > 768 ? (
          <div className="flex items-center justify-center gap-2">
            <Image
              src={contact.avatar_url}
              alt={contact.name}
              className="w-6 h-6 min-w-6 min-h-6 rounded-lg object-cover"
              width={24}
              height={24}
            />
            <h2 className="font-semibold text-lg">{contact.name}</h2>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveContact(null);
                window.history.pushState(null, "", "/app/dm");
              }}
              className="flex items-center text-text-700 transition p-1"
            >
              <ChevronLeft
                strokeWidth={1.5}
                size={24}
                className="min-w-6 min-h-6"
              />
            </button>

            <div className="flex items-center justify-center gap-2">
              <Image
                src={contact.avatar_url}
                alt={contact.name}
                className="w-6 h-6 min-w-6 min-h-6 rounded-lg object-cover"
                width={24}
                height={24}
              />
              <h2 className="font-semibold md:text-lg text-text-900 line-clamp-1">
                {contact.name}
              </h2>
            </div>
          </div>
        )}

        {contact && (
          <div className={`flex items-center justify-end h-full`}>
            <div className="flex items-center h-full">
              {/* <button className="text-text-500 md:hover:bg-text-100 md:px-2 p-1 justify-center md:rounded-lg transition flex items-center gap-1">
                <Headphones
                  strokeWidth={1.5}
                  size={screenWidth > 768 ? 16 : 20}
                />
                <span className="hidden md:inline-block">Huddle</span>
              </button>

              {screenWidth > 768 && (
                <button className="text-text-500 hover:bg-text-100 w-7 h-7 md:rounded-lg transition flex items-center justify-center">
                  <MoreVertical
                    strokeWidth={2}
                    size={16}
                    className="min-w-4 min-h-4"
                  />
                </button>
              )} */}

              {screenWidth > 768 && (
                <button
                  onClick={() => {
                    setActiveContact(null);
                    window.history.pushState(null, "", "/app/dm");
                  }}
                  className="text-text-500 hover:bg-text-100 w-7 h-7 md:rounded-lg transition flex items-center justify-center"
                >
                  <X strokeWidth={2} size={16} className="min-w-4 min-h-4" />
                </button>
              )}

              {/* <li>
              {project && (
                <ActiveProjectMoreOptions
                  project={project}
                  stateActions={{
                    setProjectEdit: (value) =>
                      toggleModal("projectEdit", value as boolean),
                    setSaveTemplate: (value) =>
                      toggleModal("saveTemplate", value as boolean),
                    setImportFromCSV: (value) =>
                      toggleModal("showImportFromCSV", value as boolean),
                    setExportAsCSV: (value) =>
                      toggleModal("showExportAsCSV", value as boolean),
                    setShowArchiveConfirm: (value) =>
                      toggleModal("showArchiveConfirm", value as boolean),
                    setShowDeleteConfirm: (value) =>
                      toggleModal("showDeleteConfirm", value as boolean),
                    setShowCommentOrActivity: (value) =>
                      toggleModal("showCommentOrActivity", value as null),
                  }}
                />
              )}
            </li> */}
            </div>
          </div>
        )}
      </div>

      <div className={`flex-1`}>{children}</div>
    </div>
  );
};

export default DmWrapper;
