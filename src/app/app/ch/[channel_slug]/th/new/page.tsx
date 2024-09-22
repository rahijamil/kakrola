"use client";

import React from "react";
import ThreadWrapper from "../ThreadWrapper";
import { useSidebarDataProvider } from "@/context/SidebarDataContext";

const NewThreadPage = ({
  params: { channel_slug },
}: {
  params: { channel_slug: string };
}) => {
  const { channels } = useSidebarDataProvider();
  const channel = channels.find((c) => c.slug === channel_slug);

  if (!channel) return null;

  return (
    <ThreadWrapper channel={channel}>
      <div>
        {/* {screenWidth > 768 ? (
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xl">
                {forEdit ? "Edit Channel" : "New thread"}
              </h1>

              <button
                onClick={onClose}
                className="text-text-500 hover:text-text-700 hover:bg-text-100 transition p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center px-4 py-2 border-b border-text-100">
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="w-6 h-6">
                  <ChevronLeft strokeWidth={1.5} size={24} />
                </button>

                <h1 className="font-medium">
                  {forEdit ? "Edit Channel" : "New thread"}
                </h1>
              </div>

              <Button
                type="submit"
                disabled={loading || !threadTitle.trim()}
                size="xs"
                variant="ghost"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner color="white" />

                    {forEdit ? (
                      <span>Editing...</span>
                    ) : (
                      <span>Posting...</span>
                    )}
                  </div>
                ) : forEdit ? (
                  "Edit"
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          )} */}
      </div>
    </ThreadWrapper>
  );
};

export default NewThreadPage;
