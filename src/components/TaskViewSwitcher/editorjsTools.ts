import Header from "@editorjs/header";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Embed from "@editorjs/embed";
import { ToolConstructable, ToolSettings } from "@editorjs/editorjs";

export const EDITOR_JS_TOOLS:
  | {
      [toolName: string]: ToolConstructable | ToolSettings;
    }
  | undefined = {
  header: Header,
  list: List,
  checklist: Checklist,
  quote: Quote,
  code: Code,
  linkTool: LinkTool,
  image: Image,
  embed: Embed,
};
