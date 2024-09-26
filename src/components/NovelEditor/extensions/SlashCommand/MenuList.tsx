import React, { useCallback, useEffect, useRef, useState } from "react";

import { Command, MenuListProps } from "./types";
import { Surface } from "../../EditorUI/Surface";
import { DropdownButton } from "../../EditorUI/Dropdown";
import { Icon } from "../../EditorUI/icons";

export const MenuList = React.forwardRef((props: MenuListProps, ref) => {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const activeItem = useRef<HTMLButtonElement>(null);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

  // Anytime the groups change, i.e. the user types to narrow it down, we want to
  // reset the current selection to the first menu item
  useEffect(() => {
    setSelectedGroupIndex(0);
    setSelectedCommandIndex(0);
  }, [props.items]);

  const selectItem = useCallback(
    (groupIndex: number, commandIndex: number) => {
      const command = props.items[groupIndex].commands[commandIndex];
      props.command(command);
    },
    [props]
  );

  React.useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: React.KeyboardEvent }) => {
      if (event.key === "ArrowDown") {
        if (!props.items.length) {
          return false;
        }

        const commands = props.items[selectedGroupIndex].commands;

        let newCommandIndex = selectedCommandIndex + 1;
        let newGroupIndex = selectedGroupIndex;

        if (commands.length - 1 < newCommandIndex) {
          newCommandIndex = 0;
          newGroupIndex = selectedGroupIndex + 1;
        }

        if (props.items.length - 1 < newGroupIndex) {
          newGroupIndex = 0;
        }

        setSelectedCommandIndex(newCommandIndex);
        setSelectedGroupIndex(newGroupIndex);

        return true;
      }

      if (event.key === "ArrowUp") {
        if (!props.items.length) {
          return false;
        }

        let newCommandIndex = selectedCommandIndex - 1;
        let newGroupIndex = selectedGroupIndex;

        if (newCommandIndex < 0) {
          newGroupIndex = selectedGroupIndex - 1;
          newCommandIndex =
            props.items[newGroupIndex]?.commands.length - 1 || 0;
        }

        if (newGroupIndex < 0) {
          newGroupIndex = props.items.length - 1;
          newCommandIndex = props.items[newGroupIndex].commands.length - 1;
        }

        setSelectedCommandIndex(newCommandIndex);
        setSelectedGroupIndex(newGroupIndex);

        return true;
      }

      if (event.key === "Enter") {
        if (
          !props.items.length ||
          selectedGroupIndex === -1 ||
          selectedCommandIndex === -1
        ) {
          return false;
        }

        selectItem(selectedGroupIndex, selectedCommandIndex);

        return true;
      }

      return false;
    },
  }));

  useEffect(() => {
    if (activeItem.current && scrollContainer.current) {
      const offsetTop = activeItem.current.offsetTop;
      const offsetHeight = activeItem.current.offsetHeight;

      scrollContainer.current.scrollTop = offsetTop - offsetHeight;
    }
  }, [selectedCommandIndex, selectedGroupIndex]);

  const createCommandClickHandler = useCallback(
    (groupIndex: number, commandIndex: number) => {
      return () => {
        selectItem(groupIndex, commandIndex);
      };
    },
    [selectItem]
  );

  if (!props.items.length) {
    return null;
  }

  return (
    <Surface
      ref={scrollContainer}
      className="text-text-700 max-h-[min(80vh,24rem)] overflow-y-auto flex-wrap mb-8 py-1 min-w-80 rounded-lg"
      withBorder={false}
      withShadow={false}
    >
      {props.items.map((group, groupIndex: number) => (
        <React.Fragment key={`${group.title}-wrapper`}>
          <div
            className="select-none first:pt-1 px-4 py-1.5 font-medium text-xs text-text-500"
            key={`${group.title}`}
          >
            {group.title}
          </div>
          {group.commands.map((command: Command, commandIndex: number) => (
            <DropdownButton
              key={`${command.label}`}
              ref={
                selectedGroupIndex === groupIndex &&
                selectedCommandIndex === commandIndex
                  ? activeItem
                  : null
              }
              isActive={
                selectedGroupIndex === groupIndex &&
                selectedCommandIndex === commandIndex
              }
              onClick={createCommandClickHandler(groupIndex, commandIndex)}
              
            >
              <div className="flex h-10 w-10 min-w-10 min-h-10 items-center justify-center rounded-md border border-text-100 bg-background">
                <Icon
                  name={command.iconName}
                  className="w-6 h-6"
                  strokeWidth={1.5}
                />
              </div>

              <div>
                <p className="font-medium">{command.label}</p>
                <p className="text-xs text-text-500 line-clamp-1">
                  {command.description}
                </p>
              </div>
            </DropdownButton>
          ))}
        </React.Fragment>
      ))}
    </Surface>
  );
});

MenuList.displayName = "MenuList";

export default MenuList;
