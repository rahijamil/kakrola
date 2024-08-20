import React from "react";
import { Input } from "../ui/input";
import Image from "next/image";

const ShareOption = ({ onClose }: { onClose: () => void }) => {
  return (
    <>
      <div className="absolute bg-white shadow-[2px_2px_8px_0px_rgba(0,0,0,0.2)] rounded-lg border border-gray-200 p-4 w-[500px] top-11 right-5 z-20">
        <Input
          placeholder="Add people by name or email"
          type="text"
          className="border border-gray-200 focus:border-gray-400 rounded-lg px-2"
        />
        <div className="flex flex-col items-center justify-center gap-3 py-7">
          <Image
            src="/friends_family.png"
            alt="Collaborate with friends and family"
            width={220}
            height={200}
          />

          <div className="text-center space-y-1 text-gray-700">
            <h3 className="text-base font-bold">
              Collaborate with friends and family
            </h3>

            <div className="w-64">
              <p className="">
                Invite others to finally get on top of those household chores or
                plan that dream holiday.
              </p>
            </div>
          </div>

          <div className="mt-3 text-gray-600 underline">
            <p>Or, add a team to Todoist instead</p>
          </div>
        </div>
      </div>
      <div
        className="fixed top-0 left-0 bottom-0 right-0 z-10"
        onClick={onClose}
      ></div>
    </>
  );
};

export default ShareOption;
