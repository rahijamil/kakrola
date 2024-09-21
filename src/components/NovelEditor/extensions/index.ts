import {
  TiptapImage,
  TiptapLink,
  UpdatedImage,
  TaskList,
  TaskItem,
  StarterKit,
  Placeholder,
  Color,
  CodeBlockLowlight,
  TextStyle,
  HighlightExtension,
  Mathematics,
  MarkdownExtension,
} from "novel/extensions";

import Emoji from "@tiptap-pro/extension-emoji";
import Text from "@tiptap/extension-text";

import Details from "@tiptap-pro/extension-details";
import DetailsContent from "@tiptap-pro/extension-details-content";
import DetailsSummary from "@tiptap-pro/extension-details-summary";

import { Table, TableCell, TableHeader, TableRow } from "./Table";

import { ReactNodeViewRenderer } from "@tiptap/react";

import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { all, createLowlight } from "lowlight";

import { cx } from "class-variance-authority";
import { UploadImagesPlugin } from "novel/plugins";

import AutoJoiner from "tiptap-extension-auto-joiner";
import CodeBlock from "./CodeBlock";
import { EmojiUnicodeParser } from "./EmojiUnicodeParser";
import { Column, Columns } from "./MultiColumn";
import { Document } from "./Document";
import { HorizontalRule } from "./HorizontalRule";
import { TableOfContentsNode } from "./TableOfContentsNode";
import { ImageBlock } from "./ImageBlock";
import { ImageUpload } from "./ImageUpload";
import TableOfContents from "@tiptap-pro/extension-table-of-contents";

// create a lowlight instance
const lowlight = createLowlight(all);

// you can also register individual languages
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

// TODO I am using cx here to get tailwind autocomplete working, idk if someone else can write a regex to just capture the class key in objects

// You can overwrite the placeholder with your own configuration
const placeholder = Placeholder.configure({
  includeChildren: true,
  // placeholder: ({ node }) => {
  //   // console.log(node);
  //   if (node.type.name == "heading" && node.attrs.level == 1) {
  //     return "Heading 1";
  //   } else if (node.type.name == "heading" && node.attrs.level == 2) {
  //     return "Heading 2";
  //   } else if (node.type.name == "heading" && node.attrs.level == 3) {
  //     return "Heading 3";
  //   } else if (node.type.name == "heading" && node.attrs.level == 4) {
  //     return "Heading 4";
  //   } else if (node.type.name == "heading" && node.attrs.level == 5) {
  //     return "Heading 5";
  //   } else if (node.type.name == "heading" && node.attrs.level == 6) {
  //     return "Heading 6";
  //   }

  //   return "Write something, or press '/' for commands…";
  // },
});
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      "underline underline-offset-[3px] text-primary-500 cursor-pointer"
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
    class: cx("rounded-lg border border-text-100"),
  },
});

const autoJoiner = AutoJoiner.configure({
  elementsToJoin: ["bulletList", "orderedList"], // default
});

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx("list-disc list-outside leading-3 -mt-2"),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx("list-decimal list-outside leading-3 -mt-2"),
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
      class: cx("rounded-sm bg-text-200 border p-5 font-mono font-medium"),
    },
  },
  code: {
    HTMLAttributes: {
      class: cx("rounded-md bg-text-200 px-1.5 py-1 font-mono font-medium"),
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

const codeBlockLowlight = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlock);
  },
}).configure({ lowlight });

const emoji = Emoji.configure({
  enableEmoticons: true,
});

const details = Details.configure({
  persist: true,
});

export const defaultExtensions = [
  autoJoiner,
  codeBlockLowlight,
  Color,
  Columns,
  Column,
  details,
  DetailsContent,
  DetailsSummary,
  Document,
  emoji,
  EmojiUnicodeParser,
  starterKit,
  placeholder,
  tiptapLink,
  tiptapImage,
  UpdatedImage,
  taskList,
  taskItem,
  HorizontalRule,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableOfContents,
  TableOfContentsNode,
  TextStyle,
  ImageUpload,
  ImageBlock,
  HighlightExtension,
  Mathematics,
  MarkdownExtension,
  Text,
];
