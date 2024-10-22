"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface FAQAccordionProps {
  items: {
    title: string;
    content: string;
  }[];
  className?: string;
}

const FAQAccordion = ({ items, className }: FAQAccordionProps) => {
  return (
    <Accordion
      type="single"
      collapsible
      className={cn("w-full", className)}
      defaultValue="item-0"
    >
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border-b border-slate-200 last:border-0"
        >
          <AccordionTrigger className="hover:no-underline">
            <span className="text-base md:text-lg font-semibold text-slate-900 text-left">
              {item.title}
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-slate-600">
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FAQAccordion;