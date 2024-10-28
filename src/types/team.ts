import { ChannelType } from "./channel";
import { PageType } from "./pageTypes";
import { ProjectType } from "./project";
import { PersonalRoleType, TeamRoleType, WorkspaceRoleType } from "./role";
import { WorkspaceType } from "./workspace";

// Enums for predefined options
export enum Industry {
  Agriculture = "agriculture",
  ArtsEntertainment = "arts_and_entertainment",
  Automotive = "automotive",
  BankingFinancialServices = "banking_and_financial_services",
  Construction = "construction",
  Consulting = "consulting",
  ConsumerGoods = "consumer_goods",
  Education = "education",
  EnergyUtilities = "energy_and_utilities",
  FoodBeverages = "food_and_beverages",
  GovernmentPublicSector = "government_and_public_sector",
  HealthcareLifeSciences = "healthcare_and_life_sciences",
  InformationTechnology = "information_technology",
  Insurance = "insurance",
  LegalServices = "legal_services",
  Manufacturing = "manufacturing",
  NonProfit = "non_profit",
  Pharmaceuticals = "pharmaceuticals",
  RealEstate = "real_estate",
  RetailWholesale = "retail_and_wholesale",
  Telecommunications = "telecommunications",
  TransportationLogistics = "transportation_and_logistics",
  TravelHospitality = "travel_and_hospitality",
  Other = "other",
}

export enum WorkType {
  Administration = "administration",
  CustomerService = "customer_service",
  Engineering = "engineering",
  ExecutiveManagement = "executive_management",
  FinanceAccounting = "finance_and_accounting",
  HumanResources = "human_resources",
  InformationTechnology = "information_technology",
  Legal = "legal",
  Marketing = "marketing",
  Operations = "operations",
  ProductDevelopment = "product_development",
  QualityAssurance = "quality_assurance",
  Sales = "sales",
  SupplyChainManagement = "supply_chain_management",
  Other = "other",
}

export enum WorkRole {
  Owner = "owner",
  TeamLead = "team_lead",
  TeamMember = "team_member",
}

export enum OrganizationSize {
  One = "1",
  Small = "2 to 10",
  Medium = "11 to 50",
  Large = "51 to 100",
  VeryLarge = "101 to 250",
  Enterprise = "More than 250",
}

export const roleOptions = [
  { value: WorkRole.Owner, label: "I own or run the company" },
  { value: WorkRole.TeamLead, label: "I lead a team within the company" },
  { value: WorkRole.TeamMember, label: "I'm a team member" },
];

export const industryOptions = Object.values(Industry).map((value) => ({
  value,
  // replace globaly used underscores with spaces
  label: value.charAt(0).toUpperCase() + value.slice(1).replaceAll("_", " "),
}));

export const workTypeOptions = Object.values(WorkType).map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1).replaceAll("_", " "),
}));

export const organizationSizeOptions = Object.values(OrganizationSize).map(
  (value) => ({
    value,
    label: value,
  })
);

// Team type
export interface TeamType {
  id: number | string;
  name: string;
  description: string;
  avatar_url: string | null;
  profile_id: string;
  is_archived: boolean;
  updated_at: string;
  created_at?: string;
  workspace_id: WorkspaceType["id"];
  is_private: boolean;
}

// Team member type
export interface TeamMemberType {
  id: number;
  team_id: TeamType['id'];
  profile_id: string; // UUID
  email: string;
  team_role: TeamRoleType;
  joined_at?: string;
  settings: {
    projects: {
      id: ProjectType["id"];
      is_favorite: boolean;
    }[];
    pages: {
      id: PageType["id"];
      is_favorite: boolean;
    }[];
    channels: {
      id: ChannelType["id"];
      is_favorite: boolean;
    }[];
  };
}

// Personal member type
interface PersonalMemberBaseType {
  id: number | string;
  profile_id: string;
  role: PersonalRoleType;
  created_at?: string;
  settings: {
    is_favorite: boolean;
    order: number;
  };
  project_id?: number;
  page_id?: number | string;
}

export interface PersonalMemberForPageType extends PersonalMemberBaseType {
  page_id: number | string;
}

export interface PersonalMemberForProjectType extends PersonalMemberBaseType {
  project_id: number;
}

// Invite Status Enum
export enum InviteStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
}

// Invite type
export interface InviteBaseType {
  id: number;
  team_id: TeamType['id'] | null;
  email: string | null;
  role: PersonalRoleType | TeamRoleType | WorkspaceRoleType;
  status: InviteStatus;
  token: string;
  project_id?: number;
  page_id?: number;
  created_at?: string;
  workspace_id: number | null;
}

export interface ProjectInviteType extends InviteBaseType {
  project_id: number;
}

export interface PageInviteType extends InviteBaseType {
  page_id: number;
}

export interface WorkspaceInviteType extends InviteBaseType {
  workspace_id: number;
  role: WorkspaceRoleType;
  created_at: string;
}
