import NovelEditor from "@/components/NovelEditor";
import { ChannelType } from "@/types/channel";
import { JSONContent } from "novel";

const AddNewThread = ({
  threadTitle,
  setThreadTitle,
  threadContent,
  setThreadContent,
  error,
}: {
  channel: ChannelType;  threadTitle: string;
  setThreadTitle: (title: string) => void;
  threadContent: JSONContent | null;
  setThreadContent: (content: JSONContent) => void;
  error: string | null;
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
        />
      </div>

      <div className="p-4 md:p-0 whitespace-normal text-xs px-4 md:px-80">
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default AddNewThread;
