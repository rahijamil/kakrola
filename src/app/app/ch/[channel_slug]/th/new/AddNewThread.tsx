const NovelEditor = dynamic(() => import("@/components/NovelEditor"), {
  ssr: false,
});
import { ChannelType } from "@/types/channel";
import { TriangleAlert } from "lucide-react";
import { JSONContent } from "novel";
import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const AddNewThread = ({
  threadTitle,
  setThreadTitle,
  threadContent,
  setThreadContent,
  setCharsCount,
  error,
}: {
  channel: ChannelType;
  threadTitle: string;
  setThreadTitle: (title: string) => void;
  threadContent: JSONContent | null;
  setThreadContent: (content: JSONContent) => void;
  error: string | null;
  setCharsCount: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div>
      <div className="max-h-[calc(100vh-7vh)] overflow-y-auto pt-4">
        <div className="px-4 md:px-80">
          <input
            type="text"
            className="text-3xl font-bold border-none focus-visible:outline-none bg-transparent w-full placeholder:text-text-400"
            value={threadTitle}
            onChange={(e) => {
              setThreadTitle(e.target.value);
            }}
            required
            placeholder="Thread title"
            autoFocus
          />
        </div>

        <NovelEditor
          autofocus={false}
          content={threadContent}
          handleSave={(content) => {
            setThreadContent(content);
          }}
          setCharsCount={setCharsCount}
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 rounded-lg bg-text-900 text-text-100 p-2 flex items-center gap-2 w-11/12 max-w-72 shadow-lg z-50"
        >
          <TriangleAlert strokeWidth={1.5} className="w-4 h-4 text-red-500" />
          <p> {error}</p>
        </motion.div>
      )}
    </div>
  );
};

export default AddNewThread;
