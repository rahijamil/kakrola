import { ViewTypes } from "@/types/viewTypes";
import { CalendarDays, SquareKanban } from "lucide-react";

export const projectViewsToSelect: {
  id: number;
  name: ViewTypes["view"];
  icon: React.JSX.Element;
  visible: boolean;
}[] = [
  {
    id: 1,
    name: "List",
    icon: <SquareKanban size={24} strokeWidth={1.5} className="-rotate-90" />,
    visible: true,
  },
  {
    id: 2,
    name: "Board",
    icon: <SquareKanban size={24} strokeWidth={1.5} />,
    visible: true,
  },
  // {
  //   id: 3,
  //   name: "Calendar",
  //   icon: <CalendarDays size={24} strokeWidth={1.5} />,
  //   visible: true,
  // },
];
