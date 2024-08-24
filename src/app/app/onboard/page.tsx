import KakrolaLogo from "@/app/kakrolaLogo";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const OnbaordPage = () => {
  return (
    <div>
      <div className="w-11/12 mx-auto max-w-md space-y-40">
        <div className=" flex justify-between items-center py-5">
          <div className="flex items-center w-full">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <KakrolaLogo isTitle size="md" />
            </Link>
          </div>

          <div className="bg-light-primary-200 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium">
            Steps 1 of 3
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold">Create your profile</h1>
        </div>
      </div>
    </div>
  );
};

export default OnbaordPage;
