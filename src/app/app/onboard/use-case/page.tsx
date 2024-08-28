"use client";
import React, { useState } from "react";
import OnboardWrapper from "../OnboardWrapper";
import { Button } from "@/components/ui/button";
import useCaseImage from "./use_case.png";
import { BriefcaseBusiness, Hash, Lightbulb, User } from "lucide-react";
import AnimatedCircleCheck from "@/components/TaskViewSwitcher/AnimatedCircleCheck";
import { useRouter } from "next/navigation";
import MyProjects from "@/components/SidebarWrapper/TasksSidebar/MyProjects";
import Image from "next/image";

const useCases = [
  {
    id: 1,
    title: "Personal",
    icon: User,
  },
  {
    id: 2,
    title: "Work",
    icon: BriefcaseBusiness,
  },
  {
    id: 3,
    title: "Education",
    icon: Lightbulb,
  },
];

const Step2UseCase = () => {
  const [selectedUseCases, setSelectedUseCases] = useState<number[]>([]);

  const router = useRouter();

  const handleUseCaseClick = (id: number) => {
    if (selectedUseCases.includes(id)) {
      setSelectedUseCases(
        selectedUseCases.filter((useCaseId) => useCaseId !== id)
      );
    } else {
      setSelectedUseCases([...selectedUseCases, id]);
    }
  };

  const handleSubmit = () => {
    console.log("Selected use cases:", selectedUseCases);
    router.push("/app");
  };

  return (
    <OnboardWrapper
      leftSide={
        <>
          <div className="space-y-3 text-center">
            <h1 className="text-xl font-bold text-text-900">
              How do you plan to use Kakrola?
            </h1>
            <p className="text-text-500">Choose all that apply.</p>
          </div>
          <div>
            <ul className="space-y-2">
              {useCases.map((useCase) => (
                <li
                  key={useCase.id}
                  tabIndex={0}
                  className={`flex items-center justify-between cursor-pointer h-12 rounded-full px-4 border ${
                    selectedUseCases.includes(useCase.id)
                      ? "border-primary-500"
                      : "border-text-200"
                  } focus:outline-none hover:bg-text-50`}
                  onClick={() => handleUseCaseClick(useCase.id)}
                >
                  <div className="flex items-center gap-2">
                    <useCase.icon
                      strokeWidth={1.5}
                      size={20}
                      className="text-primary-500"
                    />
                    <span className="text-text-700 font-semibold">
                      {useCase.title}
                    </span>
                  </div>
                  <div>
                    <AnimatedCircleCheck
                      handleCheckSubmit={() => {}}
                      priority={"P3"}
                      is_completed={selectedUseCases.includes(useCase.id)}
                      playSound={false}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!selectedUseCases.length}
              rightContent={
                <div className="bg-background text-primary-500 rounded-full w-8 h-8 flex items-center justify-center">
                  <Hash className="w-5 h-5" />
                </div>
              }
            >
              Launch Kakrola
            </Button>
          </div>
        </>
      }
      rightSide={
        <Image
          src={useCaseImage}
          width={300}
          height={300}
          alt="Use Case"
          className="object-cover rounded-lg"
        />
      }
      useWithTeam={false}
      currentStep={2}
    />
  );
};

export default Step2UseCase;
