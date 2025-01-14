"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle, FileText, Hash } from "lucide-react";
import TabSwitcher from "@/components/TabSwitcher";

const heroItems = [
  {
    id: "projects",
    image: "/images/feature1.png",
    alt: "Kakrola Projects",
    buttonTitle: "Projects",
    icon: CheckCircle,
  },
  {
    id: "pages",
    image: "/images/feature2.png",
    alt: "Kakrola Pages",
    buttonTitle: "Pages",
    icon: FileText,
  },
  {
    id: "channels",
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

  // const nextSlide = useCallback(() => {
  //   setCurrentSlide((prevSlide) => (prevSlide + 1) % heroItems.length);
  //   stopAutoSlide();
  // }, [stopAutoSlide]);

  // const prevSlide = useCallback(() => {
  //   setCurrentSlide(
  //     (prevSlide) => (prevSlide - 1 + heroItems.length) % heroItems.length
  //   );
  //   stopAutoSlide();
  // }, [stopAutoSlide]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoSliding) {
      timer = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % heroItems.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isAutoSliding]);

  useEffect(() => {
    document.title = "Kakrola";
  }, []);

  return (
    <div className="space-y-6 lg:space-y-16">
      <div className="flex gap-4 md:gap-10 lg:gap-20 relative">
        {heroItems.map((item, index) => (
          <motion.div
            key={index}
            className="w-full flex-shrink-0 bg-kakrola-100 px-4 md:px-10 lg:px-20 pt-4 md:pt-10 lg:pt-20 rounded-lg rounded-b-none"
            animate={{
              x: `-${
                currentSlide * 100 + (currentSlide * 18.5) / heroItems.length
              }%`,
              opacity: currentSlide === index ? 1 : 0.3,
            }}
            initial={{ opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          >
            <div className="relative aspect-[4/2.5] w-full rounded-lg rounded-b-none overflow-hidden">
              <Image
                src={item.image}
                fill
                alt={item.alt}
                className={`object-cover`}
              />
            </div>
          </motion.div>
        ))}

        {/* <div className="aboslute bg-primary-100 w-full wrapper aspect-[4/2.5] rounded-lg rounded-b-none"></div> */}
      </div>

      <TabSwitcher
        size={"lg"}
        tabItems={heroItems.map((item, index) => ({
          id: item.id,
          name: item.buttonTitle,
          icon: (
            <item.icon
              className="w-4 h-4 md:w-6 md:h-6"
              strokeWidth={2}
            />
          ),
          onClick: () => changeSlide(index),
        }))}
        activeTab={heroItems[currentSlide]?.id || "projects"}
        layoutId="hero_carousel"
      />
    </div>
  );
};

export default HeroCarousel;

