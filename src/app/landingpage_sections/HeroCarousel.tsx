"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  FileText,
  Hash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const heroItems = [
  {
    image: "/images/feature1.png",
    alt: "Kakrola Projects",
    buttonTitle: "Projects",
    icon: CheckCircle,
  },
  {
    image: "/images/feature2.png",
    alt: "Kakrola Pages",
    buttonTitle: "Pages",
    icon: FileText,
  },
  {
    image: "/images/feature3.png",
    alt: "Kakrola Channels",
    buttonTitle: "Channels",
    icon: Hash,
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  const stopAutoSlide = useCallback(() => {
    setIsAutoSliding(false);
  }, []);

  const changeSlide = useCallback(
    (index: number) => {
      setCurrentSlide(index);
      stopAutoSlide();
    },
    [stopAutoSlide]
  );

  const nextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % heroItems.length);
    stopAutoSlide();
  }, [stopAutoSlide]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + heroItems.length) % heroItems.length
    );
    stopAutoSlide();
  }, [stopAutoSlide]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoSliding) {
      timer = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % heroItems.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isAutoSliding]);

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="relative group">
        <div className="flex overflow-hidden rounded-lg border border-text-100 shadow-[1px_1px_8px_0px_rgba(0,0,0,0.1)]">
          {heroItems.map((item, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 transition-opacity ease-in-out duration-500"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
                opacity: currentSlide === index ? 1 : 0,
              }}
            >
              <div className="relative aspect-square md:aspect-[4/2.5] w-full rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  fill
                  alt={item.alt}
                  priority={index === 0}
                  className={`object-cover ${index === 0 ? "object-left-top" : "object-center"}`}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/5 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/5 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 flex-wrap">
        {heroItems.map((item, index) => (
          <Button
            key={index}
            variant={currentSlide == index ? "default" : "outline"}
            onClick={() => changeSlide(index)}
            aria-label={`View ${item.buttonTitle} feature`}
          >
            <item.icon className="w-5 h-5" strokeWidth={2} />
            {item.buttonTitle}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
