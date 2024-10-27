import { Check, CircleMinus, Clock4, Pause, SquarePen } from 'lucide-react';
import { ReactNode } from 'react';

interface Props {
  status: string;
}

interface StatusInfo {
  [key: string]: { color: string; icon: ReactNode; text: string };
}
// Ensure that any new colors are added to `safelist` in tailwind.config.js
const StatusInfo: StatusInfo = {
  active: { color: 'text-[#25F497]', icon: <Check size={16} />, text: 'Active' },
  paid: { color: 'text-[#25F497]', icon: <Check size={16} />, text: 'Paid' },
  completed: { color: 'text-green-500', icon: <Check size={16} />, text: 'Completed' },
  trialing: { color: 'text-text-500', icon: <Clock4 size={16} />, text: 'Trialing' },
  draft: { color: 'text-[#797C7C]', icon: <SquarePen size={16} />, text: 'Draft' },
  ready: { color: 'text-[#797C7C]', icon: <SquarePen size={16} />, text: 'Ready' },
  canceled: { color: 'text-[#797C7C]', icon: <CircleMinus size={16} />, text: 'Canceled' },
  inactive: { color: 'text-[#F42566]', icon: <CircleMinus size={16} />, text: 'Inactive' },
  past_due: { color: 'text-[#F42566]', icon: <Clock4 size={16} />, text: 'Past due' },
  paused: { color: 'text-[#F79636]', icon: <Pause size={16} />, text: 'Paused' },
  billed: { color: 'text-[#F79636]', icon: <Clock4 size={16} />, text: 'Unpaid invoice' },
};

export function Status({ status }: Props) {
  const { color, icon, text } = StatusInfo[status] ?? { text: status };
  return (
    <div
      className={`self-end flex items-center gap-2 border rounded-lg border-text-100 py-1 px-2 ${color} w-fit`}
    >
      {icon}
      {text}
    </div>
  );
}
