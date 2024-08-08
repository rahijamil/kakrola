import { Check, X } from "lucide-react";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const AddTeam = ({ onClose }: { onClose: () => void }) => {
  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 flex items-start pt-40 z-10 justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md shadow-lg flex w-[800px] h-[400px] relative"
        onClick={(ev) => ev.stopPropagation()}
      >
        {/* Left Section */}
        <div className="flex-1 p-8 flex flex-col">
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Add a team</h2>
              <p className="text-sm text-gray-600 mt-2">
                Each team comes with 5 free projects. Upgrade as your needs
                grow.{" "}
                <span className="font-semibold text-gray-800">
                  Each team is billed separately.
                </span>
              </p>
            </div>

            <div>
              <Input
                type="text"
                id="teamName"
                label="Team Name"
                placeholder="The name of your team or company"
              />

              <p className="mt-2 text-sm text-gray-500">
                Keep it something simple your teammates will recognize.
              </p>
            </div>
          </div>

          <div>
            <Button size="sm" fullWidth>
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
        <div className="w-[41%] bg-indigo-50/50 p-8 rounded-md flex flex-col gap-6 items-center justify-center">
          <img src="/team-illustration.png" alt="Team Illustration" />

          <div className="px-4">
            <h3 className="text-base font-semibold">
              A home for your team's work
            </h3>
            <ul className="mt-2 text-[13px] text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <div>
                  <Check strokeWidth={1.5} className="text-green-500 w-4 h-4" />
                </div>
                Get a shared workspace for team projects
              </li>
              <li className="flex items-start gap-2">
                <div>
                  <Check strokeWidth={1.5} className="text-green-500 w-4 h-4" />
                </div>
                Easily share work via links
              </li>
              <li className="flex items-start gap-2">
                <div>
                  <Check strokeWidth={1.5} className="text-green-500 w-4 h-4" />
                </div>
                Filter personal from team tasks
              </li>
              <li className="flex items-start gap-2">
                <div>
                  <Check strokeWidth={1.5} className="text-green-500 w-4 h-4" />
                </div>
                Control access to team data
              </li>
              <li className="flex items-start gap-2">
                <div>
                  <Check strokeWidth={1.5} className="text-green-500 w-4 h-4" />
                </div>
                Centralize member management
              </li>
            </ul>
          </div>
        </div>

        <button className="absolute right-2 top-2 p-1 hover:bg-gray-200 rounded-md transition" onClick={onClose}>
          <X strokeWidth={1.5} className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default AddTeam;
