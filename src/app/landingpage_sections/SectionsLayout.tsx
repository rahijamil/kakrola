import {
  CalendarCheck2,
  CheckCircle,
  Lightbulb,
  LucideProps,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const sections = [
  {
    id: "section1",
    label: "Organize Tasks Effortlessly",
    content:
      "Organize and prioritize your tasks with ease. Break down complex projects into manageable steps, set due dates, and stay on top of your to-do list. Whether you're working solo or with a team, task management has never been this intuitive.",
    imgSrc: "/images/feature1.png",
    icon: CheckCircle,
  },
  // {
  //   id: "section2",
  //   label: "Schedule Smartly",
  //   content:
  //     "Plan your day with intelligent scheduling features. Automatically schedule tasks based on your availability and deadlines, ensuring that you're always working on what's most important. Our smart scheduler adapts to your work habits for optimized productivity.",
  //   video: "/images/feature4.mov",
  //   icon: CalendarCheck2,
  // },
  {
    id: "section3",
    label: "Collaborate Seamlessly",
    content:
      "Work together seamlessly with your team. Share tasks, assign roles, and track progress in real-time. Communication and coordination are key to any successful project, and our collaboration tools make it effortless to keep everyone on the same page.",
    imgSrc: "/images/feature1.png",
    icon: Users,
  },
  {
    id: "section4",
    label: "Capture Ideas Instantly",
    content:
      "Never lose a brilliant idea with quick note-taking. Capture thoughts, ideas, and inspiration on the go. Integrate your notes with tasks and projects to turn ideas into action.",
    video: "/images/feature4.mov",
    icon: Lightbulb,
  },
];

const SectionsLayout = () => {
  return (
    <section
      className="py-20 sm:py-32 z-10 sm:z-0 relative bg-[#E6E6FA]"
      id="top-features"
    >
      <div className="lg:wrapper space-y-8 md:space-y-16 lg:space-y-32">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            className={`flex gap-4 md:gap-8 lg:gap-20 ${
              index % 2 !== 0 ? "flex-col-reverse lg:flex-row items-end lg:items-start" : "flex-col-reverse lg:flex-row-reverse"
            }`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div
              className={`p-4 lg:pl-0 lg:w-[45%] flex flex-col justify-center mb-8 lg:mb-0 ${
                index % 2 !== 0 ? "" : "self-center"
              }`}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div
                  className={`${
                    index == 0
                      ? "text-white bg-indigo-600 p-4 rounded-md"
                      : index == 1
                      ? "text-white bg-purple-600 p-4 rounded-md"
                      : index == 2
                      ? "text-white bg-pink-600 p-4 rounded-md"
                      : "text-white bg-teal-600 p-4 rounded-md"
                  }`}
                >
                  <section.icon size={24} />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  {section.label}
                </h3>
              </div>
              <p className="text-lg text-gray-700">{section.content}</p>
            </div>

            <div
              className={`w-11/12 lg:w-[55%] overflow-hidden border pt-4 sm:pt-8 ${
                index % 2 !== 0 ? "pl-4 sm:pl-8 rounded-l-3xl" : "pr-4 sm:pr-8 rounded-r-3xl"
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
              <div className={`relative aspect-video overflow-hidden`}>
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
