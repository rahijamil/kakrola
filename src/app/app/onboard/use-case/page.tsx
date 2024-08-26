"use client";
import React, { useState } from "react";
import OnboardWrapper from "../OnboardWrapper";
import { Button } from "@/components/ui/button";
import createPorfileImage from "../create-profile/create-profile.png";
import { BriefcaseBusiness, Lightbulb, User } from "lucide-react";
import AnimatedCircleCheck from "@/components/TaskViewSwitcher/AnimatedCircleCheck";
import { useRouter } from "next/navigation";

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
                  className={`flex items-center justify-between cursor-pointer h-10 rounded-lg pl-3 pr-2 border ${
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
              size="sm"
            >
              Launch Kakrola
            </Button>
          </div>
        </>
      }
      imageSrc={createPorfileImage}
      useWithTeam={false}
      currentStep={2}
    />
  );
};

export default Step2UseCase;
