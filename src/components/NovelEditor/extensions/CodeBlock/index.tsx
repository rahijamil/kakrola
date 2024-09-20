import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import React from "react";

import "./Codeblock.scss"

export default ({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}:
  | {
      node: {
        attrs: {
          language: string;
        };
      };
      updateAttributes: (attrs: { language: string }) => void;
      extension: {
        options: {
          lowlight: {
            listLanguages: () => string[];
          };
        };
      };
    }
  | any) => (
  <NodeViewWrapper className="code-block">
    <select
      contentEditable={false}
      defaultValue={defaultLanguage}
      onChange={(event) => updateAttributes({ language: event.target.value })}
    >
      <option value="null">auto</option>
      <option disabled>—</option>
      {extension.options.lowlight
        .listLanguages()
        .map((lang: any, index: any) => (
          <option key={index} value={lang}>
            {lang}
          </option>
        ))}
    </select>
    <pre>
      <NodeViewContent as="code" />
    </pre>
  </NodeViewWrapper>
);
