import {
  useState,
  useEffect,
  useRef,
  ReactNode,
  LegacyRef,
  Dispatch,
  SetStateAction,
} from "react";

interface DropdownProps {
  Label: (props: {
    ref: LegacyRef<HTMLElement>;
    onClick: () => void;
  }) => ReactNode;
  items?: {
    id: number;
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    devide?: boolean;
    className?: string;
  }[];
  content?: ReactNode;
  contentWidthClass?: string;
  className?: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Dropdown: React.FC<DropdownProps> = ({
  Label,
  items = [],
  className,
  content,
  contentWidthClass,
  isOpen,
  setIsOpen,
}) => {
  const [position, setPosition] = useState({
    top: "auto",
    bottom: "auto",
    left: "auto",
    right: "auto",
  });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (menuRef.current && buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const menuRect = menuRef.current.getBoundingClientRect();
        const spaceFromBottom = window.innerHeight - buttonRect.bottom;
        const spaceFromTop = buttonRect.top;
        const spaceFromLeft = buttonRect.left;
        const spaceFromRight = window.innerWidth - buttonRect.right;

        setPosition({
          top:
            spaceFromBottom < menuRect.height && spaceFromTop > menuRect.height
              ? "auto"
              : `${buttonRect.bottom}px`,
          bottom:
            spaceFromBottom >= menuRect.height ? "auto" : `${spaceFromTop}px`,
          left:
            spaceFromRight < menuRect.width && spaceFromLeft > menuRect.width
              ? "auto"
              : `${buttonRect.left}px`,
          right:
            spaceFromRight >= menuRect.width ? "auto" : `${spaceFromLeft}px`,
        });
      }
    };

    // Update the position on mount and when the window is resized
    updatePosition();
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [menuRef, buttonRef]);

  return (
    <>
      <div className={`${className}`}>
        <Label ref={buttonRef} onClick={() => setIsOpen(true)} />

        {isOpen && (
          <div
            ref={menuRef}
            style={{
              top: position.top,
              bottom: position.bottom,
              left: position.left,
              right: position.right,
            }}
            className={`z-50 bg-white shadow-[2px_2px_8px_0px_rgba(0,0,0,0.2)] rounded-lg w-72 fixed overflow-hidden text-xs ${
              contentWidthClass ? contentWidthClass : "w-72 py-1"
            }`}
            id="fixed_dropdown"
          >
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center gap-4 ${item.className}`}
              >
                {item.icon} {item.label}
              </button>
            ))}

            {content}
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed top-0 left-0 bottom-0 right-0 z-10"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Dropdown;
