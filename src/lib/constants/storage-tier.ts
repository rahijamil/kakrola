export const KakrolaStorageTiers: any[] = [
  {
    name: "Free",
    id: "free",
    features: [
      // ... other features
      "100MB total storage",
      "5MB max file size",
    ],
  },
  {
    name: "Plus",
    id: "plus",
    features: [
      // ... other features
      "10GB storage per member",
      "50MB max file size",
    ],
  },
  {
    name: "Business",
    id: "business",
    features: [
      // ... other features
      "100GB storage per member",
      "250MB max file size",
      "Contact us for additional storage needs",
    ],
  }
];

export function calculateStorageLimit(plan: string, teamSize: number): number {
  switch(plan) {
    case 'free': return 100 * 1024 * 1024; // 100MB
    case 'plus': return 10 * 1024 * 1024 * 1024 * teamSize; // 10GB per member
    case 'business': return 100 * 1024 * 1024 * 1024 * teamSize; // 100GB per member
    default: return 0;
  }
}

export function getMaxFileSize(plan: string): number {
  switch(plan) {
    case 'free': return 5 * 1024 * 1024; // 5MB
    case 'plus': return 50 * 1024 * 1024; // 50MB
    case 'business': return 250 * 1024 * 1024; // 250MB
    default: return 0;
  }
}