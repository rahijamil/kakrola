import React from "react";
import {
  FaceSmileIcon,
  MicrophoneIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import {Textarea} from "../ui";

const AddComentForm = ({ onCancelClick }: { onCancelClick?: () => void }) => {
  return (
    <div className="border border-text-200 rounded-lg p-4 focus-within:border-text-400">
      <Textarea
        placeholder="Comment"
        className="resize-none"
        rows={3}
        fullWidth
        autoFocus
      ></Textarea>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <button className="p-[5px] rounded-lg hover:bg-primary-50 transition">
            <PaperClipIcon className="w-5 h-5" />
          </button>
          <button className="p-[5px] rounded-lg hover:bg-primary-50 transition">
            <MicrophoneIcon className="w-5 h-5" />
          </button>
          <button className="p-[5px] rounded-lg hover:bg-primary-50 transition">
            <FaceSmileIcon className="w-5 h-5" />
          </button>
          <button className="p-[5px] rounded-lg hover:bg-primary-50 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M3 10.01V6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v4.01c0 .1.134.142.198.066l.057-.066A3.014 3.014 0 0 1 19 9.401a3 3 0 1 1-.802 4.523c-.064-.076-.198-.033-.198.066V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4.01c0-.569.4-.93.764-1.049.357-.117.86-.065 1.201.341a2 2 0 1 0 0-2.564c-.34.406-.844.458-1.2.341A1.103 1.103 0 0 1 3 10.01ZM5 5a1 1 0 0 0-1 1v4.01c0 .1.135.142.198.066A3.016 3.016 0 0 1 5 9.401a3 3 0 1 1-.802 4.523C4.135 13.848 4 13.89 4 13.99V18a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.01c0-.569.4-.93.764-1.049.358-.117.86-.065 1.201.341a2 2 0 1 0 0-2.564c-.34.406-.843.458-1.2.341A1.103 1.103 0 0 1 17 10.01V6a1 1 0 0 0-1-1H5Z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div className="flex justify-end gap-2">
          {onCancelClick && (
            <button
              type="button"
              onClick={onCancelClick}
              className="px-4 py-2 text-text-600 rounded hover:bg-primary-50 text-xs font-semibold"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            className="px-4 py-2 text-white bg-primary-600 rounded hover:bg-primary-700 text-xs font-semibold"
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddComentForm;
