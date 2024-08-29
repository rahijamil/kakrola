import { FC } from "react";

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

export const Select: FC<SelectProps> = ({ value, onChange, children }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="block w-full px-3 py-2 border border-text-300 bg-surface rounded-full shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600 sm:text-sm"
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-text-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};
