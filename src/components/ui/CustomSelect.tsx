import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, LucideProps } from "lucide-react";
import Dropdown from "./Dropdown";

export interface SelectorOption {
  value: string;
  label: string;
  color?: string;
}

interface CustomSelectProps {
  id: string;
  label?: string;
  Icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  value?: string | null;
  onChange: (e: {
    target: { id: string; value: string; label?: string };
  }) => void;
  options: SelectorOption[];
  placeholder?: string;
  height?: string;
  forListView?: boolean;
  showFocusInMobile?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  label,
  Icon,
  value,
  onChange,
  options,
  placeholder,
  height,
  forListView,
  showFocusInMobile = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < options.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (e.key === "Enter" && highlightedIndex !== -1) {
      e.preventDefault();
      onChange({ target: { id, value: options[highlightedIndex].value } });
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const selectedOption = options.find((option) => option.value === value);

  const triggerRef = useRef(null);

  return (
    <Dropdown
      title={placeholder}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerRef={triggerRef}
      Label={({ onClick }) => (
        <>
          {label && (
            <label
              htmlFor={id}
              className="block font-semibold text-text-700 mb-2 pl-4 md:pl-0"
            >
              {label}
            </label>
          )}
          {forListView ? (
            <button
              ref={triggerRef}
              data-form-element={true}
              className="flex items-center justify-between w-full px-4 py-1.5 hover:bg-text-100 transition md:rounded-lg h-10 md:h-8 gap-4"
              type="button"
              onClick={onClick}
            >
              <span className="text-text-500">Reminder</span>

              <div
                className={`flex items-center justify-end w-full ${
                  height ? height : "h-12"
                }`}
                onClick={onClick}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="combobox"
                aria-controls="listbox"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby={id}
              >
                <div className="flex items-center gap-2">
                  {selectedOption?.color && (
                    <div
                      className="w-3 h-3 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: selectedOption.color }}
                    ></div>
                  )}
                  {Icon && (
                    <Icon className="w-5 h-5 text-text-400 flex-shrink-0" />
                  )}
                  <span
                    className={`truncate ${
                      selectedOption ? "text-text-900" : "text-text-500"
                    }`}
                  >
                    {selectedOption ? selectedOption.label : placeholder}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-text-500 flex-shrink-0" />
              </div>
            </button>
          ) : (
            <div
              ref={triggerRef}
              data-form-element={true}
              className={`flex items-center justify-between w-full ${
                height ? height : "h-10"
              } border-text-300 md:cursor-pointer hover:border-text-400 px-4 pr-3 py-2 focus:ring-ring focus:ring-offset-2 ring-primary-300 focus:border-text-300 ${
                showFocusInMobile
                  ? "rounded-lg border focus:ring-2"
                  : "md:rounded-lg border-b md:border md:focus:ring-2"
              }`}
              onClick={onClick}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="combobox"
              aria-controls="listbox"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              aria-labelledby={id}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {selectedOption?.color && (
                  <div
                    className="w-3 h-3 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: selectedOption.color }}
                  ></div>
                )}
                {Icon && (
                  <Icon className="w-5 h-5 text-text-400 flex-shrink-0" />
                )}
                <span
                  className={`truncate ${
                    selectedOption ? "text-text-900" : "text-text-400"
                  }`}
                >
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
              </div>
              <ChevronDown className="w-5 h-5 text-text-400 flex-shrink-0 ml-2" />
            </div>
          )}
        </>
      )}
      items={options.map((option, index) => ({
        id: index,
        label: option.label,
        className: "py-2",
        onClick: () => {
          onChange({
            target: { id, value: option.value, label: option.label },
          });
        },
        rightContent: value === option.value && (
          <Check
            strokeWidth={2}
            className="w-4 h-4 text-primary-600 flex-shrink-0 ml-2"
          />
        ),
        icon: option.color && (
          <div
            className="w-3 h-3 rounded-lg flex-shrink-0"
            style={{ backgroundColor: option.color }}
          ></div>
        ),
      }))}
      contentWidthClass="w-full max-w-sm py-1 max-h-72 overflow-y-auto"
    />
  );
};

export default CustomSelect;
