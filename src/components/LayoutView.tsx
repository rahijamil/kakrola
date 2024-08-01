import { ViewTypes } from "@/types/viewTypes";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";

const views: {
  id: number;
  name: ViewTypes["view"];
  icon: React.JSX.Element;
}[] = [
  {
    id: 1,
    name: "List",
    icon: <Image src="/ListBorderIcon.svg" width={24} height={25} alt="List" />,
  },
  {
    id: 2,
    name: "Board",
    icon: (
      <Image
        src="/ListBorderIcon.svg"
        width={24}
        height={25}
        alt="List"
        className="rotate-90"
      />
    ),
  },
  {
    id: 3,
    name: "Calendar",
    icon: (
      <div className="relative">
        <Image src="/CalendarIcon.svg" width={24} height={25} alt="List" />

        <Image
          src="/ProIcon.svg"
          width={12}
          height={12}
          alt="List"
          className="absolute bottom-0 right-0"
        />
      </div>
    ),
  },
];

const LayoutView = ({
  view,
  setView,
  showHelper,
  hideCalendarView,
}: {
  view: ViewTypes["view"];
  setView: Dispatch<SetStateAction<ViewTypes["view"]>>;
  showHelper?: boolean;
  hideCalendarView?: boolean;
}) => {
  return (
    <div>
      <div className="flex items-center justify-between gap-8 font-bold mb-3">
        <h5>View</h5>
        {showHelper && (
          <QuestionMarkCircleIcon className="w-5 h-5 text-gray-500" />
        )}
      </div>

      <div>
        <ul className="bg-gray-100 text-gray-700 rounded-md overflow-hidden flex items-center gap-1 p-1">
          {views.map((v) => (
            <>
              {v.name === "Calendar" && hideCalendarView ? null : (
                <li
                  key={v.id}
                  className={`flex flex-col items-center justify-center gap-1 py-1 rounded-md cursor-pointer flex-1 transition border ${
                    v.name == view
                      ? "bg-white border-gray-200"
                      : "hover:bg-gray-200 border-transparent"
                  }`}
                  onClick={() => setView(v.name)}
                >
                  {v.icon}

                  <span className="text-xs">{v.name}</span>
                </li>
              )}
            </>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LayoutView;
