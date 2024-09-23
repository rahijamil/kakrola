import useScreen from "@/hooks/useScreen";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";
import React, { useState } from "react";
import { generateSlug } from "@/utils/generateSlug";
import { useAuthProvider } from "@/context/AuthContext";
import { supabaseBrowser } from "@/utils/supabase/client";
import { ChannelType, ThreadType } from "@/types/channel";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import { Input } from "@/components/ui/input";
import NovelEditor from "@/components/NovelEditor";
import { JSONContent } from "novel";

const AddEditThread = ({
  threadId,
  onClose,
  channel,
}: {
  threadId?: number;
  onClose: () => void;
  channel?: ChannelType;
}) => {
  const { screenWidth } = useScreen();
  const { profile } = useAuthProvider();

  const [threadTitle, setThreadTitle] = useState("");
  const [threadContent, setThreadContent] = useState<JSONContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forEdit = !!threadId;

  const handleAddChannel = async () => {
    if (!profile?.id || !channel) return;

    if (!threadTitle) {
      setError("Thread title is required.");
      return;
    }

    if (!threadContent) {
      setError("Thread content is required.");
      return;
    }

    try {
      setLoading(true);
      if (error) setError(null);

      if (forEdit) {
      } else {
        const threadData: Omit<ThreadType, "id"> = {
          title: threadTitle,
          slug: generateSlug(threadTitle),
          content: threadContent,
          profile_id: profile.id,
          channel_id: channel.id,
          is_edited: false,
        };

        const { data, error } = await supabaseBrowser
          .from("threads")
          .insert(threadData);

        if (error) throw error;
      }
    } catch (error: any) {
      console.error(error);
      error.message && setError(error.message);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: 20,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="bg-surface md:rounded-lg md:shadow-xl w-full space-y-6 md:space-y-8 max-w-3xl h-full md:h-auto"
          onClick={(e) => e.stopPropagation()}
        >
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

          <div className="md:space-y-8 max-h-[calc(100vh-30vh)] overflow-y-auto">
            <input
              type="text"
              className="text-3xl font-bold border-none rounded-lg focus-visible:outline-none bg-transparent w-full px-8 pt-8"
              value={threadTitle}
              onChange={(e) => {
                setThreadTitle(e.target.value);
              }}
              required
              placeholder="Thread title"
              autoFocus
            />

            <NovelEditor
              autofocus={false}
              content={threadContent}
              handleSave={(content) => {
                setThreadContent(content);
              }}
            />
          </div>

          <div className="p-4 md:p-0 whitespace-normal text-xs">
            {error && <p className="text-red-500 text-center">{error}</p>}
          </div>

          {screenWidth > 768 && (
            <div className="flex items-center justify-between p-8 pt-0">
              <div className="flex items-center justify-end gap-4">
                <Button
                  // onClick={() => setCurrentStep(1)}
                  disabled={loading}
                  type="button"
                  variant="outline"
                >
                  Discard
                </Button>

                <Button
                  onClick={handleAddChannel}
                  disabled={loading || !threadTitle.trim()}
                  type="button"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner color="white" size="sm" />

                      {forEdit ? (
                        <span>Editing...</span>
                      ) : (
                        <span>Creating...</span>
                      )}
                    </div>
                  ) : forEdit ? (
                    "Edit"
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddEditThread;
