"use client";
import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  type JSONContent,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { useEffect, useRef, useState } from "react";
import { defaultExtensions } from "./extensions";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { NodeSelector } from "./selectors/node-selector";
import { MathSelector } from "./selectors/math-selector";
import { Separator } from "./EditorUI/Separator";

import "./styles/index.scss";

import { ContentItemMenu } from "./menus/ContentItemMenu";

import { handleImageDrop, handleImagePaste } from "novel/plugins";
// import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { uploadFn } from "./image-upload";
import { TextButtons } from "./selectors/text-buttons";
// import { slashCommand, suggestionItems } from "./slash-command";
import { debounce } from "lodash";
import { defaultEditorContent } from "./content";

import hljs from "highlight.js";
import useTheme from "@/hooks/useTheme";
import { TableColumnMenu, TableRowMenu } from "./extensions/Table/menus";
import { LinkMenu } from "./menus/LinkMenu";
import { ColumnsMenu } from "./extensions/MultiColumn/menus";
import { SlashCommand } from "./extensions/SlashCommand";

const extensions = [...defaultExtensions, SlashCommand];

const NovelEditor = ({
  content,
  handleSave,
}: {
  content: JSONContent | null;
  handleSave: (content: JSONContent) => void;
}) => {
  const { theme } = useTheme();
  const menuContainerRef = useRef(null);
  const [initialContent, setInitialContent] = useState<null | JSONContent>(
    content
  );
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState();

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  //Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      // @ts-ignore
      // https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightelement
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  const debouncedUpdates = debounce(async (editor: EditorInstance) => {
    const json = editor.getJSON();
    setCharsCount(editor.storage.characterCount?.words());
    window.localStorage.setItem(
      "html-content",
      highlightCodeblocks(editor.getHTML())
    );
    window.localStorage.setItem("novel-content", JSON.stringify(json));
    window.localStorage.setItem(
      "markdown",
      editor.storage.markdown?.getMarkdown()
    );

    handleSave(json);
    setSaveStatus("Saved");
  }, 500);

  useEffect(() => {
    const content = window.localStorage.getItem("novel-content");
    if (content) setInitialContent(JSON.parse(content));
    else setInitialContent(defaultEditorContent);
  }, []);

  if (!initialContent) return null;

  return (
    <div className="relative w-full" ref={menuContainerRef}>
      <div className="flex absolute right-5 top-5 z-10 mb-5 gap-2">
        <div className="rounded-lg bg-primary-200 px-2 py-1">{saveStatus}</div>
        <div
          className={
            charsCount
              ? "rounded-lg bg-primary-200 px-2 py-1 text-sm text-text-700"
              : "hidden"
          }
        >
          {charsCount} Words
        </div>
      </div>

      <EditorRoot>
        <EditorContent
          autofocus
          initialContent={initialContent}
          extensions={extensions}
          className="relative min-h-[calc(100vh-10vh)] w-full"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: `prose prose-sm min-h-[calc(100vh-10vh)] ${
                theme == "dark" && "prose-invert"
              } prose-headings:font-title font-default focus:outline-none max-w-full`,
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            setSaveStatus("Unsaved");
          }}
          slotAfter={<ImageResizer />}
        >
          {/* <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-text-200 bg-surface px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-text-600">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command && item.command(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-text-100 aria-selected:bg-text-200 cursor-pointer"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-text-200 bg-text-900 text-surface">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-text-600">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand> */}

          <EditorBubble
            tippyOptions={{
              placement: openAI ? "bottom-start" : "top",
            }}
            className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-text-200 bg-surface shadow-xl"
          >
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <TextButtons />
            <MathSelector />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </EditorBubble>

          {/* <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch> */}

          <ContentItemMenu />
          <LinkMenu appendTo={menuContainerRef} />
          <ColumnsMenu appendTo={menuContainerRef} />
          <TableRowMenu appendTo={menuContainerRef} />
          <TableColumnMenu appendTo={menuContainerRef} />
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default NovelEditor;