export const integrationConfigs: Record<string, any> = {
  //   asana: {
  //     id: "asana",
  //     name: "Asana",
  //     logo: `<svg viewBox="0 0 155 144" fill="none" xmlns="http://www.w3.org/2000/svg">
  //     <path d="M110.73 34.0139C110.73 52.5445 95.7048 67.581 77.1742 67.581C58.6319 67.581 43.607 52.5562 43.607 34.0139C43.607 15.4716 58.6319 0.446716 77.1742 0.446716C95.7048 0.446716 110.73 15.4716 110.73 34.0139ZM33.5671 75.967C15.0365 75.967 0 90.9919 0 109.523C0 128.053 15.0248 143.09 33.5671 143.09C52.1094 143.09 67.1343 128.065 67.1343 109.523C67.1343 90.9919 52.1094 75.967 33.5671 75.967ZM120.77 75.967C102.227 75.967 87.2024 90.9919 87.2024 109.534C87.2024 128.076 102.227 143.101 120.77 143.101C139.3 143.101 154.337 128.076 154.337 109.534C154.337 90.9919 139.312 75.967 120.77 75.967Z" fill="#FF584A"/>
  //     </svg>`,
  //     authUrl: "https://trello.com/1/authorize",
  //     apiBase: "https://api.trello.com/1",
  //     apiKey: process.env.NEXT_PUBLIC_TRELLO_API_KEY || "",
  //     tokenStorage: "trello_token",
  //   },
  notion: {
    id: "notion",
    name: "Notion",
    logo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <path d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z" fill="#fff"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z" fill="#000"/>
    </svg>`,
    authUrl: "https://api.notion.com/v1/oauth/authorize",
    apiBase: "https://api.notion.com/v1",
    apiKey: process.env.NEXT_PUBLIC_NOTION_CLIENT_ID || "",
    clientId: process.env.NEXT_PUBLIC_NOTION_CLIENT_ID,
    tokenStorage: "notion_token",
    scope: "read_user_tasks read_databases",
  },
  trello: {
    id: "trello",
    name: "Trello",
    logo: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 80 80"><defs><style>.cls-1{fill-rule:evenodd;fill:url(#linear-gradient);}</style><linearGradient id="linear-gradient" x1="40" y1="70.47" x2="40" y2="9.53" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0052cc"/><stop offset="1" stop-color="#2684ff"/></linearGradient></defs><g id="Logos"><path class="cls-1" d="M63.22,9.53H16.78a7.26,7.26,0,0,0-7.25,7.25V63.22a7.26,7.26,0,0,0,7.25,7.25H63.22a7.26,7.26,0,0,0,7.25-7.25V16.78A7.26,7.26,0,0,0,63.22,9.53ZM35.78,53.42a2.41,2.41,0,0,1-2.41,2.41H23.19a2.41,2.41,0,0,1-2.41-2.41V23.19a2.41,2.41,0,0,1,2.41-2.41H33.37a2.41,2.41,0,0,1,2.41,2.41ZM59.22,39.54A2.41,2.41,0,0,1,56.81,42H46.63a2.41,2.41,0,0,1-2.41-2.41V23.19a2.41,2.41,0,0,1,2.41-2.41H56.81a2.41,2.41,0,0,1,2.41,2.41Z"/></g></svg>`,
    authUrl: "https://trello.com/1/authorize",
    apiBase: "https://api.trello.com/1",
    apiKey: process.env.NEXT_PUBLIC_TRELLO_API_KEY || "",
    tokenStorage: "trello_token",
  },
  // Add more integrations here
};
