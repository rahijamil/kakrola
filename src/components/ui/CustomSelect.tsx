import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, LucideProps } from "lucide-react";

export interface SelectorOption {
  value: string;
  label: string;
  color?: string;
}

interface CustomSelectProps {
  id: string;
  label: string;
  Icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  value?: string;
  onChange: (e: { target: { id: string; value: string, label?: string } }) => void;
  options: SelectorOption[];
  placeholder?: string;
  height?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  label,
  Icon,
  value,
  onChange,
  options,
  placeholder,
  height
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

  return (
    <div className="relative" ref={selectRef}>
      <label
        htmlFor={id}
        className="block font-semibold text-text-700 mb-1"
      >
        {label}
      </label>
      <div
        className={`flex items-center justify-between w-full h-10 border border-text-300 rounded-lg cursor-pointer bg-surface hover:border-text-400 px-3 py-2 focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-primary-300 focus:border-text-300 ${height}`}
        onClick={() => setIsOpen(!isOpen)}
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
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: selectedOption.color }}
            ></div>
          )}
          {Icon && <Icon className="w-5 h-5 text-text-400 flex-shrink-0" />}
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

      {isOpen && (
        <ul
          className="absolute z-10 w-full mt-1 bg-surface border border-text-300 rounded-lg shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              className={`px-4 cursor-pointer flex items-center justify-between ${height ? height : "py-2"} ${
                index === highlightedIndex
                  ? "bg-primary-100"
                  : "hover:bg-text-50"
              }`}
              onClick={() => {
                onChange({ target: { id, value: option.value, label: option.label } });
                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              role="option"
              aria-selected={value === option.value}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {option.color && (
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: option.color }}
                  ></div>
                )}
                <span className="truncate">{option.label}</span>
              </div>
              {value === option.value && (
                <Check
                  strokeWidth={1.5}
                  className="w-4 h-4 text-primary-600 flex-shrink-0 ml-2"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
