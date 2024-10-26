import { Group } from "./types";

export const GROUPS: Group[] = [
  // {
  //   name: 'ai',
  //   title: 'AI',
  //   commands: [
  //     {
  //       name: 'aiWriter',
  //       label: 'AI Writer',
  //       iconName: 'Sparkles',
  //       description: 'Let AI finish your thoughts',
  //       shouldBeHidden: editor => editor.isActive('columns'),
  //       action: editor => editor.chain().focus().setAiWriter().run(),
  //     },
  //     {
  //       name: 'aiImage',
  //       label: 'AI Image',
  //       iconName: 'Sparkles',
  //       description: 'Generate an image from text',
  //       shouldBeHidden: editor => editor.isActive('columns'),
  //       action: editor => editor.chain().focus().setAiImage().run(),
  //     },
  //   ],
  // },
  {
    name: "format",
    title: "Format",
    commands: [
      {
        name: "text",
        label: "Text",
        iconName: "ALargeSmall",
        description: "Just start writing with plain text.",
        aliases: ["text", "paragraph"],
        action: (editor) => {
          editor.chain().focus().toggleNode("paragraph", "paragraph").run();
        },
      },
      {
        name: "heading1",
        label: "Heading 1",
        iconName: "Heading1",
        description: "Big section heading.",
        aliases: ["h1"],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 1 }).run();
        },
        shouldBeHidden: (editor) =>
          document.querySelector(".hide-some-command") ? true : false,
      },
      {
        name: "heading2",
        label: "Heading 2",
        iconName: "Heading2",
        description: "Medium section heading.",
        aliases: ["h2"],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 2 }).run();
        },
        shouldBeHidden: (editor) =>
          document.querySelector(".hide-some-command") ? true : false,
      },
      {
        name: "heading3",
        label: "Heading 3",
        iconName: "Heading3",
        description: "Small section heading.",
        aliases: ["h3"],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 3 }).run();
        },
        shouldBeHidden: (editor) =>
          document.querySelector(".hide-some-command") ? true : false,
      },
      {
        name: "bulletList",
        label: "Bullet List",
        iconName: "List",
        description: "Create a simple bulleted list.",
        aliases: ["ul"],
        action: (editor) => {
          editor.chain().focus().toggleBulletList().run();
        },
      },
      {
        name: "numberedList",
        label: "Numbered List",
        iconName: "ListOrdered",
        description: "Create a list with numbering.",
        aliases: ["ol"],
        action: (editor) => {
          editor.chain().focus().toggleOrderedList().run();
        },
      },
      {
        name: "taskList",
        label: "To-do List",
        iconName: "ListTodo",
        description: "Track tasks with a to-do list.",
        aliases: ["todo", "task"],
        action: (editor) => {
          editor.chain().focus().toggleTaskList().run();
        },
      },
      {
        name: "toggleList",
        label: "Toggle List",
        iconName: "ListCollapse",
        description: "Toggles can hide and show content inside.",
        aliases: ["toggle"],
        action: (editor) => {
          editor.chain().focus().setDetails().run();
        },
      },
      {
        name: "blockquote",
        label: "Quote",
        iconName: "TextQuote",
        description: "Capture a quote",
        action: (editor) => {
          editor.chain().focus().setBlockquote().run();
        },
      },
      {
        name: "codeBlock",
        label: "Code",
        iconName: "CodeXml",
        description: "Capture a code snippet.",
        shouldBeHidden: (editor) => editor.isActive("columns"),
        action: (editor) => {
          editor.chain().focus().setCodeBlock().run();
        },
      },
    ],
  },
  {
    name: "insert",
    title: "Insert",
    commands: [
      {
        name: "table",
        label: "Table",
        iconName: "Table",
        description: "Add simple tabular content to your page.",
        shouldBeHidden: (editor) => editor.isActive("columns"),
        action: (editor) => {
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
            .run();
        },
      },
      {
        name: "image",
        label: "Image",
        iconName: "Image",
        description: "Insert an image",
        aliases: ["img"],
        action: (editor) => {
          editor.chain().focus().setImageUpload().run();
        },
      },
      {
        name: "columns",
        label: "2 Columns",
        iconName: "Columns2",
        description: "Create two columns of block.",
        aliases: ["cols"],
        shouldBeHidden: (editor) => editor.isActive("columns"),
        action: (editor) => {
          editor
            .chain()
            .focus()
            .setColumns()
            .focus(editor.state.selection.head - 1)
            .run();
        },
      },
      {
        name: "horizontalRule",
        label: "Divider",
        iconName: "Minus",
        description: "Insert a horizontal divider",
        aliases: ["hr"],
        action: (editor) => {
          editor.chain().focus().setHorizontalRule().run();
        },
      },
      {
        name: "toc",
        label: "Table of Contents",
        iconName: "Book",
        aliases: ["outline"],
        description: "Show an outline of your page.",
        shouldBeHidden: (editor) =>
          editor.isActive("columns") ||
          (document.querySelector(".hide-some-command") ? true : false),
        action: (editor) => {
          editor.chain().focus().insertTableOfContents().run();
        },
      },
    ],
  },
];

export default GROUPS;
