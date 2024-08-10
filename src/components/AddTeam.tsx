import { Check, Users, X } from "lucide-react";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { TeamType } from "@/types/team";
import Image from "next/image";

const AddTeam = ({ onClose }: { onClose: () => void }) => {
  const [teamData, setTeamData] = useState<TeamType>();
  const [step, setStep] = useState<0 | 1>(0);

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 flex items-center md:items-start md:pt-40 z-10 justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md shadow-lg flex flex-col-reverse md:flex-row w-11/12 max-w-md md:max-w-[800px] relative max-h-[700px] overflow-y-auto"
        onClick={(ev) => ev.stopPropagation()}
      >
        {/* Left Section */}
        <div className="flex-1 pt-4 md:pt-8 p-8 pb-0 flex flex-col">
          <div className="flex-1 md:space-y-6">
            <div className="hidden md:block">
              <h2 className="text-xl font-semibold">
                {step == 0 ? "Add a team" : "About you and your team"}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                {step == 0 ? (
                  <>
                    Each team comes with 5 free projects. Upgrade as your needs
                    grow.{" "}
                    <span className="font-semibold text-gray-800">
                      Each team is billed separately.
                    </span>
                  </>
                ) : (
                  "Your answers will help tailor your experience."
                )}
              </p>
            </div>

            <div>
              {step == 0 ? (
                <Input
                  type="text"
                  id="teamName"
                  Icon={Users}
                  label="Team Name"
                  placeholder="The name of your team or company"
                />
              ) : (
                <div className="space-y-4">
                  <Input
                    type="text"
                    id="teamName"
                    Icon={Users}
                    label="What industry do you work in?"
                    placeholder="Select your answer"
                  />

                  <Input
                    type="text"
                    id="teamName"
                    Icon={Users}
                    label="What work do you do?"
                    placeholder="Select your answer"
                  />

                  <Input
                    type="text"
                    id="teamName"
                    Icon={Users}
                    label="What’s your role?"
                    placeholder="Select your answer"
                  />

                  <Input
                    type="text"
                    id="teamName"
                    Icon={Users}
                    label="How big is your organization?"
                    placeholder="Select your answer"
                  />
                </div>
              )}

              <p className="mt-2 text-sm text-gray-500">
                {step == 0
                  ? "Keep it something simple your teammates will recognize."
                  : "Team of one? Please consider the Pro plan instead"}
              </p>
            </div>
          </div>

          <div className="mt-4 sticky left-0 bottom-0 right-0 bg-white pb-8">
            <Button fullWidth onClick={() => setStep(1)}>
              Get started
            </Button>
            <p className="mt-4 text-xs text-gray-500">
              By creating a team, you agree to our{" "}
              <a href="#" className="underline text-gray-600">
                Terms of Service
              </a>{" "}
              regarding team workspaces.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-[41%] md:bg-indigo-50/50 pb-4 md:pb-8 p-8 rounded-md flex flex-col gap-4 md:gap-6 items-center">
          <Image src="/team-illustration.png" alt="Team Illustration" width={400} height={400} />

          <div className="md:hidden">
            <h2 className="text-xl font-semibold">Add a team</h2>
            <p className="text-sm text-gray-600 mt-2">
              Each team comes with 5 free projects. Upgrade as your needs grow.{" "}
              <span className="font-semibold text-gray-800">
                Each team is billed separately.
              </span>
            </p>
          </div>

          <div className="md:px-4">
            <h3 className="text-base font-semibold">
              A home for your team&apos;s work
            </h3>
            <ul className="mt-2 text-[13px] text-gray-600 md:space-y-2 grid grid-cols-2 md:grid-cols-1 gap-x-2">
              <li className="flex items-center md:items-start gap-2">
                <div>
                  <Check strokeWidth={1.5} className="text-green-500 w-4 h-4" />
                </div>
                Get a shared workspace for team projects
              </li>
              <li className="flex items-center md:items-start gap-2">
                <div>
                  <Check strokeWidth={1.5} className="text-green-500 w-4 h-4" />
                </div>
                Easily share work via links
              </li>
              <li className="flex items-center md:items-start gap-2">
                <div>
                  <Check strokeWidth={1.5} className="text-green-500 w-4 h-4" />
                </div>
                Filter personal from team tasks
              </li>
              <li className="flex items-center md:items-start gap-2">
                <div>
                  <Check strokeWidth={1.5} className="text-green-500 w-4 h-4" />
                </div>
                Control access to team data
              </li>
              <li className="flex items-center md:items-start gap-2">
                <div>
                  <Check strokeWidth={1.5} className="text-green-500 w-4 h-4" />
                </div>
                Centralize member management
              </li>
            </ul>
          </div>
        </div>

        <button
          className="absolute right-2 top-2 p-[6px] hover:bg-gray-200 rounded-md transition"
          onClick={onClose}
        >
          <X strokeWidth={1.5} className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default AddTeam;
