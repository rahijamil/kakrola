import {
  Check,
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  TextQuote,
  ListOrdered,
  Code,
  CheckSquare,
  type LucideIcon,
  ListCollapse,
  ALargeSmall,
  CodeXml,
} from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";

import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "../EditorUI/Popover";
import { Button } from "../EditorUI/Button";

export type SelectorItem = {
  name: string;
  icon: LucideIcon;
  command: (editor: ReturnType<typeof useEditor>["editor"]) => void;
  isActive: (editor: ReturnType<typeof useEditor>["editor"]) => boolean;
};

const headingItems: SelectorItem[] = document.querySelector(".hide-some-command")
  ? []
  : [
      {
        name: "Heading 1",
        icon: Heading1,
        command: (editor) =>
          editor?.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: (editor) => !!!!editor?.isActive("heading", { level: 1 }),
      },
      {
        name: "Heading 2",
        icon: Heading2,
        command: (editor) =>
          editor?.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: (editor) => !!editor?.isActive("heading", { level: 2 }),
      },
      {
        name: "Heading 3",
        icon: Heading3,
        command: (editor) =>
          editor?.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: (editor) => !!editor?.isActive("heading", { level: 3 }),
      },
    ];

const items: SelectorItem[] = [
  {
    name: "Text",
    icon: ALargeSmall,
    command: (editor) =>
      editor?.chain().focus().toggleNode("paragraph", "paragraph").run(),
    // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
    isActive: (editor) =>
      !!!!editor?.isActive("paragraph") &&
      !editor.isActive("bulletList") &&
      !editor.isActive("orderedList"),
  },
  ...headingItems,
  {
    name: "Bullet List",
    icon: ListOrdered,
    command: (editor) => editor?.chain().focus().toggleBulletList().run(),
    isActive: (editor) => !!editor?.isActive("bulletList"),
  },
  {
    name: "Numbered List",
    icon: ListOrdered,
    command: (editor) => editor?.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => !!editor?.isActive("orderedList"),
  },
  {
    name: "To-do List",
    icon: CheckSquare,
    command: (editor) => editor?.chain().focus().toggleTaskList().run(),
    isActive: (editor) => !!editor?.isActive("taskItem"),
  },
  {
    name: "Toggle list",
    icon: ListCollapse,
    command: (editor) => editor?.chain().focus().setDetails().run(),
    isActive: (editor) => !!editor?.isActive("details"),
  },
  {
    name: "Quote",
    icon: TextQuote,
    command: (editor) =>
      editor
        ?.chain()
        .focus()
        .toggleNode("paragraph", "paragraph")
        .toggleBlockquote()
        .run(),
    isActive: (editor) => !!editor?.isActive("blockquote"),
  },
  {
    name: "Code",
    icon: CodeXml,
    command: (editor) => editor?.chain().focus().toggleCodeBlock().run(),
    isActive: (editor) => !!editor?.isActive("codeBlock"),
  },
];
interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NodeSelector = ({ open, onOpenChange }: NodeSelectorProps) => {
  const { editor } = useEditor();
  if (!editor) return null;
  const activeItem = items.filter((item) => item.isActive(editor)).pop() ?? {
    name: "Multiple",
  };

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        asChild
        className="gap-2 rounded-none border-none hover:bg-text-100 focus:ring-0"
      >
        <Button variant="ghost" className="gap-2">
          <span className="whitespace-nowrap text-sm">{activeItem.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={5} align="start" className="w-48 p-1">
        {items.map((item, index) => (
          <EditorBubbleItem
            key={index}
            onSelect={(editor) => {
              item.command(editor);
              onOpenChange(false);
            }}
            className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1 text-xs hover:bg-text-100"
          >
            <div className="flex items-center space-x-2">
              <div className="rounded-md border border-text-100 p-1 bg-background">
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <span>{item.name}</span>
            </div>
            {activeItem.name === item.name && <Check className="h-4 w-4" strokeWidth={1.5} />}
          </EditorBubbleItem>
        ))}
      </PopoverContent>
    </Popover>
  );
};
