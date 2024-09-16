import { ChevronDown } from "lucide-react";
import {
  useState,
  useEffect,
  useRef,
  ReactNode,
  Dispatch,
  SetStateAction,
  RefObject,
} from "react";

interface DropdownProps {
  Label: (props: { onClick: (ev: any) => void }) => ReactNode;
  items?: {
    id: number;
    label: string;
    onClick: () => void;
    summary?: string;
    icon?: ReactNode;
    divide?: boolean;
    className?: string;
    content?: ReactNode;
    textColor?: string;
    disabled?: boolean;
    rightContent?: ReactNode;
  }[];
  dataFromElement?: boolean;
  autoClose?: boolean;
  content?: ReactNode;
  contentWidthClass?: string;
  className?: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  triggerRef: RefObject<HTMLElement> | null;
  direction?: "top-right" | "bottom-left";
  beforeItemsContent?: ReactNode;
  mobileBottomSheet?: boolean;
  title?: string;
  fullMode?: boolean;
}

import { AnimatePresence, motion } from "framer-motion";
import useScreen from "@/hooks/useScreen";
import { useRouter } from "next/navigation";

const Dropdown: React.FC<DropdownProps> = ({
  Label,
  items = [],
  className,
  content,
  contentWidthClass,
  isOpen,
  dataFromElement,
  setIsOpen,
  triggerRef,
  direction = "top-right",
  autoClose = true,
  beforeItemsContent,
  mobileBottomSheet = true,
  title = "More",
  fullMode,
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
  const { screenWidth } = useScreen();

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);

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

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }
  }, [isOpen]);

  useEffect(() => {
    const handlePopState = (ev: PopStateEvent) => {
      ev.preventDefault();
      // Close the dropdown when the back button is pressed
      setIsOpen(false);
    };

    if (isOpen && screenWidth <= 768) {
      // Add a new history entry only when opening the dropdown
      window.history.pushState(null, "", window.location.href);

      // Listen for the popstate event to handle the back button
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      // Clean up the event listener when the dropdown is closed
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, screenWidth]);

  const [showContent, setShowContent] = useState(false);
  const toggleContent = () => {
    setShowContent(!showContent);
  };

  const isTopRight = direction === "top-right";

  const handleTouchStart = (e: any) => {
    setIsDragging(true);
    setDragStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: any) => {
    if (isDragging && menuRef.current) {
      e.preventDefault();

      const scrollTop = menuRef.current.scrollTop;
      const touchY = e.touches[0].clientY;
      const offsetY = touchY - dragStartY;

      // Prevent upward scrolling beyond the dropdown's top
      if (offsetY > 0 && scrollTop === 0) {
        setDragOffsetY(offsetY);
      } else {
        setDragOffsetY(0);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      if (dragOffsetY > 100) {
        setIsOpen(false);
      }
      setIsDragging(false);
      setDragOffsetY(0);
    }
  };

  return (
    <>
      <div className={className}>
        <Label
          onClick={(ev) => {
            ev.stopPropagation();
            setIsOpen(true);
          }}
        />

        <AnimatePresence>
          {isOpen && (
            <>
              {screenWidth > 768 || !mobileBottomSheet ? (
                <motion.div
                  initial={{
                    scaleY: 0.8,
                    y: isTopRight ? -10 : 10, // Upwards for top-right, downwards for bottom-left
                    opacity: 0,
                    transformOrigin: isTopRight ? "top right" : "bottom left", // Change origin
                  }}
                  animate={{
                    scaleY: 1,
                    y: isTopRight ? [0, -5, 0] : [0, 5, 0], // Subtle bounce in the respective direction
                    opacity: 1,
                    transformOrigin: isTopRight ? "top right" : "bottom left",
                  }}
                  exit={{
                    scaleY: 0.8,
                    y: isTopRight ? -10 : 10,
                    opacity: 0,
                    transformOrigin: isTopRight ? "top right" : "bottom left",
                  }}
                  transition={{
                    duration: 0.2,
                    ease: [0.25, 0.1, 0.25, 1],
                    y: {
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                    },
                  }}
                  ref={menuRef}
                  style={{
                    top: position.top,
                    bottom: position.bottom,
                    left: position.left,
                    right: position.right,
                    transform: position.transform,
                  }}
                  className={`z-50 bg-surface shadow-[2px_2px_8px_0px_rgba(0,0,0,0.2)] rounded-lg fixed overflow-hidden px-1 ${
                    contentWidthClass ? contentWidthClass : "w-72 py-1"
                  }`}
                  id="fixed_dropdown"
                  data-form-element={dataFromElement}
                  onClick={(ev) => ev.stopPropagation()}
                >
                  {beforeItemsContent}
                  {items.map((item, _index) => (
                    <>
                      <div key={_index} onClick={(ev) => ev.stopPropagation()}>
                        <button
                          onClick={() => {
                            if (item.onClick && !item.content) {
                              item.onClick();
                              if (autoClose) {
                                setIsOpen(false);
                              }
                            } else if (item.content) {
                              toggleContent();
                            }
                          }}
                          className={`w-full text-left px-4 py-1.5 hover:bg-text-100 transition flex items-center justify-between gap-4 rounded-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent ${
                            item.className
                          } ${
                            item.textColor ? item.textColor : "text-text-700"
                          }`}
                          disabled={item.disabled}
                        >
                          <div className="space-y-1">
                            <div className="flex items-start gap-4">
                              {item.icon}

                              <div className="">
                                <p
                                  className={`${
                                    item.summary ? "font-medium" : ""
                                  }`}
                                >
                                  {item.label}
                                </p>
                                {item.summary && (
                                  <p className="text-xs text-text-500">
                                    {item.summary}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {item.content && (
                            <div
                              className={`transition-transform ${
                                showContent ? "rotate-180" : "rotate-0"
                              }`}
                              onClick={toggleContent}
                            >
                              <ChevronDown
                                strokeWidth={1.5}
                                className="w-4 h-4"
                              />
                            </div>
                          )}

                          {item.rightContent}
                        </button>

                        <AnimatePresence>
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
                        </AnimatePresence>
                      </div>
                      {item.divide && (
                        <div className="w-full h-px bg-text-200 my-1"></div>
                      )}
                    </>
                  ))}
                  <div onClick={(ev) => ev.stopPropagation()}>{content}</div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{
                    y: dragOffsetY,
                    opacity: 1,
                    transition: { type: "tween", stiffness: 200, damping: 20 },
                  }}
                  exit={{ y: "100%", transition: { duration: 0.2 } }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  ref={menuRef}
                  id="fixed_dropdown"
                  data-form-element={dataFromElement}
                  onClick={(ev) => ev.stopPropagation()}
                  className={`fixed z-50 bg-surface shadow-lg rounded-t-2xl touch-none ${
                    fullMode ? "inset-0" : "inset-x-0 bottom-0"
                  }`}
                >
                  <div
                    className="space-y-2"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div className="flex items-center justify-center pt-2">
                      <div className="w-10 h-1 bg-text-200 rounded-full"></div>
                    </div>
                    <div>
                      <div className="px-4 pb-2 grid grid-cols-[55%_1fr] items-center">
                        <h3 className="text-text-700 font-bold">{title}</h3>

                        {fullMode && (
                          <div className="text-right">
                            <button
                              className="text-primary-500 font-semibold"
                              onClick={() => setIsOpen(false)}
                            >
                              Done
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="w-[calc(100%-2rem)] mx-auto h-px bg-text-200 my-1"></div>
                    </div>
                  </div>
                  {beforeItemsContent && (
                    <div className="px-4">{beforeItemsContent}</div>
                  )}
                  {items.length > 0 && (
                    <div className="pb-4 h-automax-h-[50vh]overflow-y-auto">
                      {items.map((item, _index) => (
                        <>
                          <div
                            key={_index}
                            onClick={(ev) => ev.stopPropagation()}
                          >
                            <button
                              onTouchStart={(ev) => {
                                ev.currentTarget.classList.add("bg-text-100");
                              }}
                              onTouchEnd={(ev) =>
                                ev.currentTarget.classList.remove("bg-text-100")
                              }
                              onClick={() => {
                                if (item.onClick && !item.content) {
                                  item.onClick();
                                  if (autoClose) {
                                    setIsOpen(false);
                                  }
                                } else if (item.content) {
                                  toggleContent();
                                }
                              }}
                              className={`relative overflow-hidden w-full text-left px-4 py-2.5 transition flex items-center justify-between gap-4 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent ${
                                item.className
                              } ${
                                item.textColor
                                  ? item.textColor
                                  : "text-text-700"
                              }`}
                              disabled={item.disabled}
                            >
                              <div className="space-y-1">
                                <div className="flex items-start gap-4">
                                  {item.icon}

                                  <div className="">
                                    <p
                                      className={`${
                                        item.summary ? "font-medium" : ""
                                      }`}
                                    >
                                      {item.label}
                                    </p>
                                    {item.summary && (
                                      <p className="text-xs text-text-500">
                                        {item.summary}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {item.content && (
                                <div
                                  className={`transition-transform ${
                                    showContent ? "rotate-180" : "rotate-0"
                                  }`}
                                  onClick={toggleContent}
                                >
                                  <ChevronDown
                                    strokeWidth={1.5}
                                    className="w-4 h-4"
                                  />
                                </div>
                              )}

                              {item.rightContent}
                            </button>

                            <AnimatePresence>
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
                            </AnimatePresence>
                          </div>
                          {item.divide && (
                            <div className="w-[calc(100%-2rem)] mx-auto h-px bg-text-200 my-1"></div>
                          )}
                        </>
                      ))}
                    </div>
                  )}
                  {content && (
                    <div onClick={(ev) => ev.stopPropagation()}>{content}</div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            data-form-element="true"
            className={`fixed top-0 left-0 bottom-0 right-0 z-20 ${
              screenWidth <= 768 &&
              mobileBottomSheet &&
              "bg-black bg-opacity-60"
            }`}
            onClick={(ev) => {
              ev.stopPropagation();
              setIsOpen(false);
            }}
          ></motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dropdown;
