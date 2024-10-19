export interface CredentialResponse {
  credential: string; // ID token
  select_by: string; // Determines how the ID token was selected (e.g., "auto", "user", etc.)
}

export interface Google {
  accounts: {
    id: {
      initialize(options: {
        client_id: string;
        callback: (response: CredentialResponse) => void;
        nonce?: string;
        use_fedcm_for_prompt?: boolean;
      }): void;
      prompt(): void;
    };
  };
}
declare global {
  interface Window {
    google: Google; // Use the Google interface defined below
  }
}

export {};
