import { RoleType } from "./role";

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

export interface BaseTeamType {
  name: string;
  avatar_url: string | null;
  profile_id: string;
  updated_at: string;
  created_at?: string;
}

// Team type
export interface TeamType extends BaseTeamType {
  id: number;
  industry: string;
  work_type: string;
  work_role: string;
  organization_size: string;
}

// Team member type
export interface TeamMemberType {
  id: number;
  team_id: number;
  profile_id: string; // UUID
  email: string;
  team_role: RoleType;
  joined_at?: string;
}

// Project member type
export interface ProjectMemberType {
  id: number;
  project_id: number;
  profile_id: string;
  role: RoleType;
  created_at?: string;
  project_settings: {
    is_favorite: boolean;
    order: number;
  };
}

// Invite Status Enum
export enum InviteStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
}

// Invite type
export interface InviteType {
  id: number;
  project_id: number | null;
  team_id: number | null;
  email: string | null;
  role: RoleType;
  status: InviteStatus;
  token: string;
  created_at?: string;
}