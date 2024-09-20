import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import { Slice, Fragment } from "prosemirror-model";

export const EmojiUnicodeParser = Extension.create({
  name: "emojiUnicodeParser",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          transformPasted: (slice) => {
            // Extract text from the pasted content
            const text = slice.content.textBetween(0, slice.content.size);

            // Convert Unicode sequences and emoji shortcodes to emoji characters
            const decodedText = decodeUnicodeAndShortcodes(text);

            // If the decoded text differs from the original text
            if (decodedText !== text) {
              // Create a new text node with the decoded emoji text
              const schema = slice.content.firstChild!.type.schema;
              const newTextNode = schema.text(decodedText);

              // Create a new Fragment with the updated text node
              const newFragment = Fragment.from(newTextNode);

              // Return a new Slice with the updated Fragment
              return new Slice(newFragment, slice.openStart, slice.openEnd);
            }

            // Return the unmodified slice if no Unicode sequences are found
            return slice;
          },
        },
      }),
    ];
  },
});

// Function to decode both Unicode escape sequences and colon-based emoji shortcodes
function decodeUnicodeAndShortcodes(str: string) {
  // Replace Unicode escape sequences with the actual emoji
  let decoded = str.replace(/\\u[\dA-F]{4}/gi, (match) => {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
  });

  // Common emoji shortcodes with their emoji counterparts
  const emojiMap: Record<string, string> = {
    ":question_mark:": "❓",
    ":warning:": "⚠️",
    ":smile:": "😊",
    ":grinning:": "😀",
    ":joy:": "😂",
    ":sweat_smile:": "😅",
    ":heart_eyes:": "😍",
    ":wink:": "😉",
    ":thumbsup:": "👍",
    ":thumbsdown:": "👎",
    ":clap:": "👏",
    ":wave:": "👋",
    ":pray:": "🙏",
    ":fire:": "🔥",
    ":star:": "⭐",
    ":rocket:": "🚀",
    ":tada:": "🎉",
    ":thinking:": "🤔",
    ":facepalm:": "🤦",
    ":muscle:": "💪",
    ":eyes:": "👀",
    ":sunglasses:": "😎",
    ":100:": "💯",
    ":poop:": "💩",
    ":cry:": "😢",
    ":sob:": "😭",
    ":party_popper:": "🎉",
    ":balloon:": "🎈",
    ":birthday:": "🎂",
    ":sparkles:": "✨",
    ":boom:": "💥",
    ":kiss:": "💋",
    ":blue_heart:": "💙",
    ":red_heart:": "❤️",
    ":yellow_heart:": "💛",
    ":green_heart:": "💚",
    ":purple_heart:": "💜",
    ":black_heart:": "🖤",
    ":skull:": "💀",
    ":ghost:": "👻",
    ":alien:": "👽",
    ":sun:": "☀️",
    ":moon:": "🌙",
    ":stars:": "🌟",
    ":rainbow:": "🌈",
    ":earth_americas:": "🌎",
    ":airplane:": "✈️",
    ":car:": "🚗",
    ":train:": "🚆",
    ":coffee:": "☕",
    ":beer:": "🍺",
    ":pizza:": "🍕",
    ":hamburger:": "🍔",
    ":fries:": "🍟",
    ":cake:": "🍰",
    ":cookie:": "🍪",
    ":ice_cream:": "🍦",
    ":soccer:": "⚽",
    ":basketball:": "🏀",
    ":football:": "🏈",
    ":medal:": "🏅",
    ":trophy:": "🏆",
    ":hourglass:": "⏳",
    ":computer:": "💻",
    ":mobile_phone:": "📱",
    ":telephone:": "☎️",
  };

  // Replace all shortcode occurrences with their corresponding emojis
  Object.keys(emojiMap).forEach((shortcode) => {
    decoded = decoded.replace(new RegExp(shortcode, "g"), emojiMap[shortcode]);
  });

  return decoded;
}
