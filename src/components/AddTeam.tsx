import React, { useState } from "react";
import {
  X,
  ChevronRight,
  Users,
  Briefcase,
  Building,
  UserCircle,
  Users2,
  ChevronDown,
  LucideProps,
  Group,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TeamType } from "@/types/team";
import { useAuthProvider } from "@/context/AuthContext";

const CustomSelect = ({
  id,
  label,
  Icon,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  label: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  value: string;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { id: string; value: string } }
  ) => void;
  options: string[];
  placeholder: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div
        className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-md cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Icon className="w-5 h-5 text-gray-400 mr-2" />
          <span className={`${value ? "text-gray-900" : "text-gray-400"}`}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </div>

      {isOpen && (
        <>
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <li
                key={option}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onChange({ target: { id, value: option } });
                  setIsOpen(false);
                }}
              >
                {option}
              </li>
            ))}
          </ul>

          <div
            onClick={() => setIsOpen(false)}
            className="fixed top-0 left-0 bottom-0 right-0"
          ></div>
        </>
      )}
    </div>
  );
};

const AddTeam = ({ onClose }: { onClose: () => void }) => {
  const { profile } = useAuthProvider();
  const [teamData, setTeamData] = useState<Omit<TeamType, "id">>({
    name: "",
    industry: "",
    workType: "",
    role: "",
    organizationSize: "",
    avatar_url: "",
    profile_id: profile?.id || "",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  });
  const [step, setStep] = useState<0 | 1>(0);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { id: string; value: string } }
  ) => {
    setTeamData({ ...teamData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 0) {
      setStep(1);
    } else {
      // Handle team creation logic here
      console.log("Team data:", teamData);
      onClose();
    }
  };

  const industryOptions = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Manufacturing",
    "Other",
  ];

  const workTypeOptions = [
    "Software Development",
    "Marketing",
    "Sales",
    "Customer Support",
    "Human Resources",
    "Other",
  ];

  const roleOptions = [
    "I own or run the company",
    "I lead a team within the company",
    "I'm a team member",
  ];

  const organizationSizeOptions = [
    "1",
    "2-10",
    "11-50",
    "51-100",
    "101-250",
    "More than 250",
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {step === 0 ? "Add a team" : "Tell us about your team"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition p-1 rounded-md"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {step === 0 ? (
            <div className="space-y-4">
              <Input
                type="text"
                id="name"
                label="Team name"
                Icon={Users}
                value={teamData.name}
                onChange={handleInputChange}
                placeholder="The name of your team or company"
                required
                autoComplete="off"
              />
              <p className="text-sm text-gray-500">
                Keep it something simple your teammates will recognize.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <CustomSelect
                id="industry"
                label="What industry do you work in?"
                Icon={Briefcase}
                value={teamData.industry}
                onChange={handleInputChange}
                options={industryOptions}
                placeholder="Select your answer"
              />
              <CustomSelect
                id="workType"
                label="What work do you do?"
                Icon={Building}
                value={teamData.workType}
                onChange={handleInputChange}
                options={workTypeOptions}
                placeholder="Select your answer"
              />
              <CustomSelect
                id="role"
                label="What's your role?"
                Icon={UserCircle}
                value={teamData.role}
                onChange={handleInputChange}
                options={roleOptions}
                placeholder="Select your answer"
              />
              <CustomSelect
                id="organizationSize"
                label="How big is your organization"
                Icon={Users}
                value={teamData.organizationSize}
                onChange={handleInputChange}
                options={organizationSizeOptions}
                placeholder="Select your answer"
              />
            </div>
          )}

          <div className="mt-6">
            <Button type="submit" fullWidth>
              {step === 0 ? "Get started" : "Setup and continue"}
              {step === 0 && <ChevronRight size={16} className="ml-2" />}
            </Button>
          </div>
        </form>

        {step === 0 && (
          <div className="px-6 pb-6 text-xs text-gray-500">
            By creating a team, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            .
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTeam;
