"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

interface AccordionItemProps {
  title: string;
  content: string;
  defaultOpen?: boolean;
  isLast?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  content,
  defaultOpen,
  isLast,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || false);

  return (
    <div className={`border-b border-text-200 ${isLast ? "border-none" : ""}`}>
      <button
        className="flex justify-between items-center w-full py-5 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base md:text-xl font-semibold text-text-900">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Plus className="w-6 h-6 text-text-500" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="pb-5 text-text-600">{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface AccordionProps {
  items: AccordionItemProps[];
}

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          defaultOpen={index === 0}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
};
