import { JSONContent } from "novel";

export const getTextFromContent = (content: JSONContent): string => {
  let text = "";
  if (content.text) {
    text += content.text;
  }
  if (content.content) {
    content.content.forEach((element) => {
      text += getTextFromContent(element);
    });
  }
  return text;
};
