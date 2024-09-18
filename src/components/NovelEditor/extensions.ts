import {
  TiptapImage,
  TiptapLink,
  UpdatedImage,
  TaskList,
  TaskItem,
  HorizontalRule,
  StarterKit,
  Placeholder,
} from "novel/extensions";

import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";

import { cx } from "class-variance-authority";
import { UploadImagesPlugin } from "novel/plugins";

import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import AutoJoiner from "tiptap-extension-auto-joiner";

// TODO I am using cx here to get tailwind autocomplete working, idk if someone else can write a regex to just capture the class key in objects

// You can overwrite the placeholder with your own configuration
const placeholder = Placeholder.configure({
  placeholder: ({ node }) => {
    // console.log(node);
    if (node.type.name == "heading" && node.attrs.level == 1) {
      return "Heading 1";
    } else if (node.type.name == "heading" && node.attrs.level == 2) {
      return "Heading 2";
    } else if (node.type.name == "heading" && node.attrs.level == 3) {
      return "Heading 3";
    }

    return "Write something, or press '/' for commands…";
  },
});
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      "text-text-500 underline underline-offset-[3px] hover:text-primary-500 transition-colors cursor-pointer"
    ),
  },
});

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx("not-prose pl-2"),
  },
});
const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx("my-4 flex items-center"),
  },
  nested: true,
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx("mt-4 mb-6 border-t border-text-300"),
  },
});

const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: cx("opacity-40 rounded-lg border border-stone-200"),
      }),
    ];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: cx("rounded-lg border border-text-200"),
  },
});

const globalDragHandle = GlobalDragHandle.configure({
  dragHandleWidth: 20, // default

  // The scrollTreshold specifies how close the user must drag an element to the edge of the lower/upper screen for automatic
  // scrolling to take place. For example, scrollTreshold = 100 means that scrolling starts automatically when the user drags an
  // element to a position that is max. 99px away from the edge of the screen
  // You can set this to 0 to prevent auto scrolling caused by this extension
  scrollTreshold: 100, // default
});

const autoJoiner = AutoJoiner.configure({
  elementsToJoin: ["bulletList", "orderedList"], // default
});

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx("list-disc list-inside leading-3 -mt-2"),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx("list-decimal list-inside leading-3 -mt-2"),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx("leading-normal -mb-2"),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx("border-l-4 border-primary-500"),
    },
  },
  codeBlock: {
    HTMLAttributes: {
      class: cx("rounded-sm bg-texxt-200 border p-5 font-mono font-medium"),
    },
  },
  code: {
    HTMLAttributes: {
      class: cx("rounded-md bg-text-200  px-1.5 py-1 font-mono font-medium"),
      spellcheck: "false",
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: "#DBEAFE",
    width: 4,
  },
  gapcursor: false,
});

const table = Table.configure({
  resizable: true,
});

export const defaultExtensions = [
  starterKit,
  placeholder,
  tiptapLink,
  tiptapImage,
  UpdatedImage,
  taskList,
  taskItem,
  horizontalRule,
  globalDragHandle,
  autoJoiner,
  table,
  TableRow,
  TableHeader,
  TableCell,
];
