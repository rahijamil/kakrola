import Image from "next/image";
import {
  CalendarCheck2,
  CheckCircle,
  Lightbulb,
  Users,
  LucideProps,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { motion } from "framer-motion"; // Animation library

const sections: {
  id: string;
  label: string;
  content: string;
  video?: string;
  imgSrc?: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}[] = [
  {
    id: "section1",
    label: "Task Management",
    content: "Organize and prioritize your tasks with ease.",
    imgSrc: "/images/feature1.png",
    icon: CheckCircle,
  },
  {
    id: "section2",
    label: "Smart Scheduling",
    content: "Plan your day with intelligent scheduling features.",
    video: "/images/feature4.mov",
    icon: CalendarCheck2,
  },
  {
    id: "section3",
    label: "Team Collaboration",
    content: "Work together seamlessly with your team.",
    imgSrc: "/images/feature1.png",
    icon: Users,
  },
  {
    id: "section4",
    label: "Idea Capture",
    content: "Never lose a brilliant idea with quick note-taking.",
    video: "/images/feature4.mov",
    icon: Lightbulb,
  },
];

const SectionsLayout = () => {
  return (
    <section
      className="py-20 sm:py-32 bg-gradient-to-br from-white via-indigo-50 to-white"
      id="top-features"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wider uppercase">
            Features
          </h2>
          <p className="mt-4 text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            Organize, plan, and <span className="text-indigo-600">achieve more</span>
          </p>
        </div>

        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            className={`flex flex-col md:flex-row ${
              index % 2 !== 0 ? "" : "md:flex-row-reverse gap-8 md:gap-16"
            } md:space-x-8`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="md:w-[45%] flex flex-col justify-center mb-8 md:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <section.icon className="w-6 h-6 text-indigo-600 hover:scale-110 transform transition-all duration-300" />
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {section.label}
                </h3>
              </div>
              <p className="text-lg text-gray-700">{section.content}</p>
            </div>

            <div
              className={`md:w-[55%] overflow-hidden border pt-8 ${
                index % 2 !== 0 ? "pl-8 rounded-l-3xl" : "pr-8 rounded-r-3xl"
              } ${
                index == 0
                  ? "bg-indigo-600 border-indigo-600"
                  : index == 1
                  ? "bg-purple-600 border-purple-600"
                  : index == 2
                  ? "bg-pink-600 border-pink-600"
                  : "bg-teal-600 border-teal-600"
              }`}
            >
              <div className={`relative aspect-video overflow-hidden `}>
                {section.video ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src={section.video} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={section.imgSrc || ""}
                    alt={section.label || ""}
                    className="object-cover"
                    layout="fill"
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SectionsLayout;
