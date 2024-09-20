import React, { useCallback, useRef, useState, useEffect } from "react";
import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react";
import { useEditor } from "novel";
import Dropdown from "@/components/ui/Dropdown";
import { Icon } from "@/components/NovelEditor/EditorUI/icons";
import * as PopoverMenu from "@/components/NovelEditor/EditorUI/PopoverMenu";
import {
  MenuProps,
  ShouldShowProps,
} from "@/components/NovelEditor/menus/types";
import { isRowGripSelected } from "./utils";
import { Toolbar } from "@/components/NovelEditor/EditorUI/Toolbar";

export const TableRowMenu: React.FC<MenuProps> = ({ appendTo }) => {
  const { editor } = useEditor();
  const [isOpen, setIsOpen] = useState(true);
  const triggerRef = useRef<HTMLDivElement>(null);

  if (!editor) return null;

  const shouldShow = useCallback(
    ({ view, state, from }: ShouldShowProps) => {
      if (!state || !from) {
        return false;
      }
      return isRowGripSelected({ editor, view, state, from });
    },
    [editor]
  );

  const onAddRowBefore = useCallback(() => {
    editor.chain().focus().addRowBefore().run();
    setIsOpen(false);
  }, [editor]);

  const onAddRowAfter = useCallback(() => {
    editor.chain().focus().addRowAfter().run();
    setIsOpen(false);
  }, [editor]);

  const onDeleteRow = useCallback(() => {
    editor.chain().focus().deleteRow().run();
    setIsOpen(false);
  }, [editor]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey="tableRowMenu"
      updateDelay={0}
      tippyOptions={{
        appendTo: () => {
          return appendTo?.current;
        },
        placement: "left",
        offset: [0, 15],
        popperOptions: {
          modifiers: [{ name: "flip", enabled: false }],
        },
      }}
      shouldShow={shouldShow}
    >
      <Toolbar.Wrapper isVertical>
        <PopoverMenu.Item
          iconComponent={<Icon name="ArrowUpToLine" />}
          close={false}
          label="Add row before"
          onClick={onAddRowBefore}
        />
        <PopoverMenu.Item
          iconComponent={<Icon name="ArrowDownToLine" />}
          close={false}
          label="Add row after"
          onClick={onAddRowAfter}
        />
        <PopoverMenu.Item
          icon="Trash"
          close={false}
          label="Delete row"
          onClick={onDeleteRow}
        />
      </Toolbar.Wrapper>
    </BaseBubbleMenu>
  );
};

export default TableRowMenu;
