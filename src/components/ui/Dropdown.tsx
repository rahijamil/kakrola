import { ChevronDown } from "lucide-react";
import {
  useState,
  useEffect,
  useRef,
  ReactNode,
  LegacyRef,
  Dispatch,
  SetStateAction,
  RefObject,
} from "react";

interface DropdownProps {
  Label: (props: { onClick: () => void }) => ReactNode;
  items?: {
    id: number;
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    divide?: boolean;
    className?: string;
    content?: ReactNode;
  }[];
  content?: ReactNode;
  contentWidthClass?: string;
  className?: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  triggerRef: RefObject<HTMLElement> | null;
}

import { motion } from "framer-motion";

const Dropdown: React.FC<DropdownProps> = ({
  Label,
  items = [],
  className,
  content,
  contentWidthClass,
  isOpen,
  setIsOpen,
  triggerRef,
}) => {
  const [position, setPosition] = useState<{
    top: string;
    bottom: string;
    left: string;
    right: string;
    transform: string;
  }>({
    top: "auto",
    bottom: "auto",
    left: "auto",
    right: "auto",
    transform: "none",
  });

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (menuRef.current && triggerRef?.current) {
        const buttonRect = triggerRef.current.getBoundingClientRect();
        const menuRect = menuRef.current.getBoundingClientRect();

        const spaceFromBottom = window.innerHeight - buttonRect.bottom;
        const spaceFromTop = buttonRect.top;
        const spaceFromLeft = buttonRect.left;
        const spaceFromRight = window.innerWidth - buttonRect.right;

        let top = "auto";
        let bottom = "auto";
        let left = "auto";
        let right = "auto";
        let transform = "none";

        // Vertical positioning
        if (spaceFromBottom >= menuRect.height) {
          top = `${buttonRect.bottom}px`;
        } else if (spaceFromTop >= menuRect.height) {
          bottom = `${window.innerHeight - buttonRect.top}px`;
        } else {
          // Not enough space on either side; position below and scroll
          top = `${buttonRect.bottom}px`;
          transform = `translateY(${Math.min(
            spaceFromBottom - menuRect.height,
            0
          )}px)`;
        }

        // Horizontal positioning
        if (spaceFromRight >= menuRect.width) {
          left = `${buttonRect.left}px`;
        } else if (spaceFromLeft >= menuRect.width) {
          right = `${window.innerWidth - buttonRect.right}px`;
        } else {
          // Not enough space on either side; position left and scroll
          left = `${buttonRect.left}px`;
          transform += ` translateX(${Math.min(
            spaceFromRight - menuRect.width,
            0
          )}px)`;
        }

        setPosition({ top, bottom, left, right, transform });
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, triggerRef]);

  const [showContent, setShowContent] = useState(false);
  const toggleContent = () => {
    setShowContent(!showContent);
  };

  return (
    <>
      <div className={className}>
        <Label onClick={() => setIsOpen(true)} />

        {isOpen && (
          <div
            ref={menuRef}
            style={{
              top: position.top,
              bottom: position.bottom,
              left: position.left,
              right: position.right,
              transform: position.transform,
            }}
            className={`z-50 bg-surface shadow-lg rounded-lg fixed overflow-hidden text-xs ${
              contentWidthClass ? contentWidthClass : "w-72 py-1"
            }`}
          >
            {items.map((item) => (
              <>
                <div>
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.onClick && !item.content) {
                        item.onClick();
                        setIsOpen(false);
                      } else if (item.content) {
                        toggleContent();
                      }
                    }}
                    className={`w-full text-left px-4 py-2 text-sm text-text-700 hover:bg-background transition flex items-center justify-between ${item.className}`}
                  >
                    <div className="flex items-center gap-4">
                      {item.icon} {item.label}
                    </div>

                    {item.content && (
                      <div
                        className={`transition-transform ${
                          showContent ? "rotate-180" : "rotate-0"
                        }`}
                        onClick={toggleContent}
                      >
                        <ChevronDown strokeWidth={1.5} className="w-4 h-4" />
                      </div>
                    )}
                  </button>

                  {item.content && showContent && (
                    <motion.div
                      style={{ overflow: "hidden" }}
                      initial={{ height: 0, opacity: 1 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: { type: "tween" },
                      }}
                      exit={{ height: 0, opacity: 1 }}
                      className="px-4 pt-1"
                    >
                      {item.content}
                    </motion.div>
                  )}
                </div>
                {item.divide && (
                  <div className="w-full h-px bg-text-200 my-1"></div>
                )}
              </>
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
