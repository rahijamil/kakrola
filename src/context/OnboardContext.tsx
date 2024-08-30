"use client";

import { Industry, OrganizationSize, WorkRole, WorkType } from "@/types/team";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";

type State = {
  work_role: { label: string; value: WorkRole } | null;
  team_name: string;
  industry: { label: string; value: Industry } | null;
  work_type: { label: string; value: WorkType } | null;
  organization_size: { label: string; value: OrganizationSize } | null;
};

type Action =
  | { type: "SET_WORK_ROLE"; payload: { label: string; value: WorkRole } }
  | { type: "SET_TEAM_NAME"; payload: string }
  | { type: "SET_INDUSTRY"; payload: { label: string; value: Industry } }
  | { type: "SET_WORK_TYPE"; payload: { label: string; value: WorkType } }
  | {
      type: "SET_ORGANIZATION_SIZE";
      payload: { label: string; value: OrganizationSize };
    };

const initialState: State = {
  work_role: null,
  team_name: "",
  industry: null,
  work_type: null,
  organization_size: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_WORK_ROLE":
      return { ...state, work_role: action.payload };
    case "SET_TEAM_NAME":
      return { ...state, team_name: action.payload };
    case "SET_INDUSTRY":
      return { ...state, industry: action.payload };
    case "SET_WORK_TYPE":
      return { ...state, work_type: action.payload };
    case "SET_ORGANIZATION_SIZE":
      return { ...state, organization_size: action.payload };
    default:
      return state;
  }
};

const OnboardContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {},
});

const OnboardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <OnboardContext.Provider value={{ state, dispatch }}>
      {children}
    </OnboardContext.Provider>
  );
};

export const useOnboard = () => {
  return useContext(OnboardContext);
};

export default OnboardProvider;
