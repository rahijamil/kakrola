import TiptapMention from "@tiptap/extension-mention";
import { cx } from "class-variance-authority";
import suggestion from "./suggestion";
export const Mention = TiptapMention.configure({
  HTMLAttributes: {
    class: cx("rounded-md bg-text-100 px-1.5 py-1 font-mono font-medium"),
  },
  suggestion,
  renderText({ options, node }) {
    return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
  },
  deleteTriggerWithBackspace: true,
});

export default Mention;
