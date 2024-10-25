import { ChevronDown } from "lucide-react";
import React, {
  useState,
  useEffect,
  useRef,
  ReactNode,
  Dispatch,
  SetStateAction,
  RefObject,
  CSSProperties,
  useCallback,
  useMemo,
  memo,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import useScreen from "@/hooks/useScreen";
import PortalWrapper from "../PortalWrapper";

export interface DropdownProps {
  Label: (props: { onClick: (ev: any) => void }) => ReactNode;
  items?: {
    id: number | string;
    label: string;
    onClick: () => void;
    summary?: string;
    icon?: ReactNode;
    divide?: boolean;
    className?: string;
    content?: ReactNode;
    textColor?: string;
    bgColor?: string;
    style?: CSSProperties;
    disabled?: boolean;
    rightContent?: ReactNode;
    parentTitle?: string;
    badge?: string;
  }[];
  dataFromElement?: boolean;
  autoClose?: boolean;
  content?: ReactNode;
  contentWidthClass?: string;
  className?: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>> | ((value: boolean) => void);
  triggerRef: RefObject<HTMLElement> | null;
  direction?: "top-right" | "bottom-left";
  beforeItemsContent?: ReactNode;
  mobileBottomSheet?: boolean;
  title?: string;
  titleRightAction?: ReactNode;
  fullMode?: boolean;
  style?: CSSProperties;
  touchMoveClose?: boolean;
  hideHeader?: boolean;
}

// Memoized dropdown item component
export const DropdownItem = memo(
  ({
    item,
    showContent,
    toggleContent,
    autoClose,
    setIsOpen,
    touchMoveClose,
  }: any) => {
    const handleClick = useCallback(() => {
      if (!item.disabled) {
        if (item.onClick && !item.content) {
          item.onClick();
          if (autoClose) {
            setIsOpen(false);
          }
        } else if (item.content) {
          toggleContent();
        }
      }
    }, [item, autoClose, setIsOpen, toggleContent]);

    const handleTouchStart = useCallback(
      (ev: React.TouchEvent<HTMLButtonElement>) => {
        ev.currentTarget.classList.add("bg-text-100");
      },
      []
    );

    const handleTouchEnd = useCallback(
      (ev: React.TouchEvent<HTMLButtonElement>) => {
        ev.currentTarget.classList.remove("bg-text-100");
      },
      []
    );

    return (
      <div onClick={(ev) => ev.stopPropagation()}>
        {item.parentTitle && (
          <p className="px-4 py-1.5 font-medium text-xs text-text-500">
            {item.parentTitle}
          </p>
        )}
        <button
          type="button"
          onTouchStart={touchMoveClose ? handleTouchStart : undefined}
          onTouchEnd={touchMoveClose ? handleTouchEnd : undefined}
          onClick={handleClick}
          className={`w-full text-left px-4 py-2.5 transition flex items-center justify-between gap-4 ${
            item.disabled
              ? "border-l-0 cursor-not-allowed hover:bg-transparent"
              : "hover:bg-primary-50 border-l-4 border-transparent hover:border-primary-200"
          } ${item.className} ${
            item.textColor ? item.textColor : "text-text-700"
          }`}
          disabled={item.disabled}
        >
          <div className="space-y-1">
            <div className="flex items-start gap-4">
              {item.icon}
              <div>
                <p
                  className={`flex items-center gap-2 ${
                    item.summary ? "font-medium" : ""
                  } ${item.bgColor || ""}`}
                  style={item.style}
                >
                  {item.label}
                  {item.badge && (
                    <span className="bg-primary-50 text-primary-500 rounded-lg px-1.5 text-[10px] font-semibold uppercase">
                      {item.badge}
                    </span>
                  )}
                </p>
                {item.summary && (
                  <p className="text-xs text-text-500">{item.summary}</p>
                )}
              </div>
            </div>
          </div>

          {item.content && (
            <div
              className={`transition-transform ${
                showContent ? "rotate-180" : "rotate-0"
              }`}
            >
              <ChevronDown strokeWidth={1.5} className="w-4 h-4" />
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
    );
  }
);

DropdownItem.displayName = "DropdownItem";

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
  titleRightAction,
  fullMode,
  style,
  touchMoveClose = true,
  hideHeader,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { screenWidth } = useScreen();
  const [showContent, setShowContent] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [position, setPosition] = useState({
    top: "auto",
    bottom: "auto",
    left: "auto",
    right: "auto",
    transform: "none",
  });

  const [animateDirection, setAnimateDirection] = useState(direction);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);

  // Memoized handlers
  const toggleContent = useCallback(() => {
    setShowContent((prev) => !prev);
  }, []);

  const updatePosition = useCallback(() => {
    if (!menuRef.current || !triggerRef?.current) return;

    const buttonRect = triggerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    const menuHeight = menuRef.current.clientHeight;
    const menuWidth = menuRef.current.clientWidth;

    const spaceBelow = window.innerHeight - buttonRect.bottom - 50;
    const spaceAbove = buttonRect.top;
    const spaceRight = window.innerWidth - buttonRect.right;

    let top = buttonRect.bottom + scrollTop;
    let left = buttonRect.left + scrollLeft;

    if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
      top = buttonRect.top + scrollTop - menuHeight;
      setAnimateDirection("bottom-left");
    } else if (spaceBelow < menuHeight && spaceAbove <= menuHeight) {
      top = buttonRect.top + scrollTop - (menuHeight - spaceBelow);
      left = buttonRect.right + scrollLeft - (menuWidth / 2 - 50);
      setAnimateDirection("bottom-left");
    }

    if (spaceRight < menuWidth) {
      left = buttonRect.right + scrollLeft - menuWidth;
    }

    setPosition({
      top: `${top}px`,
      left: `${left}px`,
      bottom: "auto",
      right: "auto",
      transform: "none",
    });
  }, [triggerRef]);

  // Touch handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    setIsDragging(true);
    setDragStartY(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !menuRef.current) return;

      const scrollTop = menuRef.current.scrollTop;
      const touchY = e.touches[0].clientY;
      const offsetY = touchY - dragStartY;

      if (offsetY > 0 && scrollTop === 0) {
        setDragOffsetY(offsetY);
        setOverlayOpen(offsetY <= (menuRef.current?.clientHeight || 200) / 3);
      } else {
        setDragOffsetY(0);
      }
    },
    [isDragging, dragStartY]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;

    if (dragOffsetY > (menuRef.current?.clientHeight || 200) / 3) {
      setIsOpen(false);
    }
    setIsDragging(false);
    setDragOffsetY(0);
  }, [isDragging, dragOffsetY, setIsOpen]);

  // Effects
  useEffect(() => {
    if (!isOpen) return;

    const handlePopState = (ev: PopStateEvent) => {
      ev.preventDefault();
      setIsOpen(false);
    };

    if (screenWidth <= 768) {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handlePopState);
      setOverlayOpen(true);
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, screenWidth, updatePosition]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [setIsOpen]);

  // Memoized animations
  const dropdownAnimations = useMemo(
    () => ({
      initial: {
        opacity: 0,
        y: direction === "top-right" ? -10 : 10,
        scale: 0.95,
      },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: {
        opacity: 0,
        y: direction === "top-right" ? -10 : 10,
        scale: 0.95,
      },
      transition: { duration: 0.12, ease: "easeInOut" },
    }),
    [direction]
  );

  const mobileAnimations = useMemo(
    () => ({
      initial: { y: "100%", opacity: 0 },
      animate: {
        y: dragOffsetY,
        opacity: 1,
        transition: { type: "tween", stiffness: 200, damping: 20 },
      },
      exit: { y: "100%", transition: { duration: 0.2 } },
    }),
    [dragOffsetY]
  );

  return (
    <div className={className}>
      <Label
        onClick={(ev) => {
          ev.stopPropagation();
          setIsOpen(!isOpen);
        }}
      />

      <PortalWrapper>
        <AnimatePresence mode="wait">
          {isOpen && (
            <>
              {screenWidth > 768 || !mobileBottomSheet ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  data-form-element="true"
                  className="fixed inset-0 z-[60] pointer-events-auto"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setIsOpen(false);
                    setOverlayOpen(false);
                  }}
                >
                  <motion.div
                    {...dropdownAnimations}
                    ref={menuRef}
                    style={{ ...position, ...style }}
                    className={`bg-background dark:bg-surface shadow-[1px_1px_.5rem_2px_rgba(0,0,0,0.1),-1px_1px_.5rem_2px_rgba(0,0,0,0.1)] rounded-lg z-[70] fixed ${
                      contentWidthClass || "w-72 py-1"
                    }`}
                    data-form-element={dataFromElement}
                    onClick={(ev) => ev.stopPropagation()}
                  >
                    {!hideHeader && (
                      <div className="px-4 py-2 mb-1 border-b border-text-100 flex items-center justify-between gap-8">
                        <h3 className="text-text-700 text-xs font-semibold line-clamp-1">
                          {title}
                        </h3>
                        {titleRightAction}
                      </div>
                    )}

                    {beforeItemsContent}

                    {items.map((item, index) => (
                      <React.Fragment key={item.id}>
                        <DropdownItem
                          item={item}
                          showContent={showContent}
                          toggleContent={toggleContent}
                          autoClose={autoClose}
                          setIsOpen={setIsOpen}
                          touchMoveClose={touchMoveClose}
                        />
                        {item.divide && (
                          <div className="w-full h-px bg-text-100 my-1" />
                        )}
                      </React.Fragment>
                    ))}

                    {content && (
                      <div onClick={(ev) => ev.stopPropagation()}>
                        {content}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ) : (
                <MobileDropdown
                  menuRef={menuRef}
                  mobileAnimations={mobileAnimations}
                  dataFromElement={dataFromElement}
                  fullMode={fullMode}
                  title={title}
                  setIsOpen={setIsOpen}
                  setOverlayOpen={setOverlayOpen}
                  beforeItemsContent={beforeItemsContent}
                  items={items}
                  showContent={showContent}
                  toggleContent={toggleContent}
                  autoClose={autoClose}
                  content={content}
                  overlayOpen={overlayOpen}
                  touchMoveClose={touchMoveClose}
                  handleTouchStart={handleTouchStart}
                  handleTouchMove={handleTouchMove}
                  handleTouchEnd={handleTouchEnd}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </PortalWrapper>
    </div>
  );
};

// Memoized mobile dropdown
const MobileDropdown = memo(
  ({
    menuRef,
    mobileAnimations,
    dataFromElement,
    fullMode,
    title,
    setIsOpen,
    setOverlayOpen,
    beforeItemsContent,
    items,
    showContent,
    toggleContent,
    autoClose,
    content,
    overlayOpen,
    touchMoveClose,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }: any) => {
    const handleDragInteraction = useCallback(
      (ev: React.TouchEvent) => {
        if (!touchMoveClose) {
          handleTouchStart(ev);
          handleTouchMove(ev);
          handleTouchEnd();
        }
      },
      [touchMoveClose, handleTouchStart, handleTouchMove, handleTouchEnd]
    );

    return (
      <div className="fixed inset-0 z-[60] touch-none">
        <motion.div
          {...mobileAnimations}
          ref={menuRef}
          data-form-element={dataFromElement}
          onClick={(ev) => ev.stopPropagation()}
          className={`fixed z-[70] bg-surface shadow-[1px_1px_.5rem_0_rgba(0,0,0,0.1)] rounded-t-2xl touch-none ${
            fullMode ? "inset-0" : "inset-x-0 bottom-0"
          }`}
          onTouchStart={touchMoveClose ? handleTouchStart : undefined}
          onTouchMove={touchMoveClose ? handleTouchMove : undefined}
          onTouchEnd={touchMoveClose ? handleTouchEnd : undefined}
        >
          <div
            className="space-y-2"
            onTouchStart={handleDragInteraction}
            onTouchMove={handleDragInteraction}
            onTouchEnd={handleDragInteraction}
          >
            <div className="flex items-center justify-center pt-2">
              <div className="w-10 h-1 bg-text-100 rounded-full" />
            </div>
            <div>
              <div className="px-4 pb-2 grid grid-cols-[55%_1fr] items-center">
                <h3 className="text-text-700 font-bold line-clamp-1">
                  {title}
                </h3>

                {fullMode && (
                  <div className="text-right">
                    <button
                      className="text-primary-500 font-semibold"
                      onClick={() => {
                        setIsOpen(false);
                        setOverlayOpen(false);
                      }}
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
              <div className="w-[calc(100%-2rem)] mx-auto h-px bg-text-100 my-1" />
            </div>
          </div>

          {beforeItemsContent && (
            <div className="px-4">{beforeItemsContent}</div>
          )}

          {items.length > 0 && (
            <div className="pb-4 h-auto max-h-[50vh] overflow-y-auto">
              {items.map((item: any) => (
                <React.Fragment key={item.id}>
                  <DropdownItem
                    item={item}
                    showContent={showContent}
                    toggleContent={toggleContent}
                    autoClose={autoClose}
                    setIsOpen={setIsOpen}
                    touchMoveClose={touchMoveClose}
                  />
                  {item.divide && (
                    <div className="w-[calc(100%-2rem)] mx-auto h-px bg-text-100 my-1" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {content && (
            <div onClick={(ev) => ev.stopPropagation()}>{content}</div>
          )}
        </motion.div>

        <AnimatePresence>
          {!fullMode && overlayOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              data-form-element="true"
              className="fixed inset-0 z-[60] bg-black bg-opacity-60"
              onClick={() => {
                setOverlayOpen(false);
                setIsOpen(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }
);

// Add display names for debugging
DropdownItem.displayName = "DropdownItem";
MobileDropdown.displayName = "MobileDropdown";

export default memo(Dropdown);
