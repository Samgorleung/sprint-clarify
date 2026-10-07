import { DecompositionResult } from '../types/agile';

export interface StarterPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

export const STARTER_PROMPTS: StarterPrompt[] = [
  {
    id: 'biometric-auth',
    title: 'Mobile Biometric Auth',
    description: 'FaceID & Fingerprint login with keychain fallback',
    prompt: 'We need biometric authentication on iOS and Android so users stop complaining about passwords. It should fall back to PIN or password if their face is dirty or whatever, remember the session securely, and sync with our existing JWT tokens.',
  },
  {
    id: 'csv-reports',
    title: 'CSV Export & Scheduled Reports',
    description: 'Background async export with email delivery',
    prompt: 'Our enterprise customers want to export their billing transaction history to CSV. Some accounts have over 200,000 transactions so it cannot lock up the browser. They also want to schedule a monthly report sent automatically to accounting@example.com.',
  },
  {
    id: 'webhook-events',
    title: 'Webhook Event Notifications',
    description: 'Reliable webhook dispatch with exponential retries',
    prompt: 'Developers need webhooks whenever an order status changes (created, paid, refunded). Include HMAC signature verification, a retry queue with exponential backoff if their server is down, and an audit log in their dashboard.',
  },
];

export const MOCK_DECOMPOSITION: DecompositionResult = {
  summary: "Decomposition of Mobile Biometric Authentication into 1 Milestone Epic, 3 User Stories with Gherkin Acceptance Criteria, and technical dependencies.",
  epics: [
    {
      id: "EPIC-01",
      title: "Mobile Biometric Security & Keychain Storage",
      objective: "Provide secure biometric authentication across mobile platforms with seamless fallback and token persistence."
    }
  ],
  userStories: [
    {
      id: "US-01",
      epicId: "EPIC-01",
      title: "Hardware Biometric Prompt & Sensor Check",
      asA: "mobile app user",
      iWant: "to unlock my account using FaceID or fingerprint recognition",
      soThat: "I can access my workspace instantly without typing my password every session",
      acceptanceCriteria: [
        "Given the device supports biometric hardware, When the app launches, Then present the native FaceID/TouchID prompt.",
        "Given the biometric scan succeeds, When authenticated, Then decrypt and retrieve the stored refresh token.",
        "Given the biometric scan fails 3 consecutive times, When prompted, Then gracefully display the PIN / password fallback screen."
      ],
      complexity: "M",
      dependsOn: [],
      blocks: ["US-02", "US-03"],
      technicalRisks: [
        "Device fragmentation across Android OEM fingerprint implementations",
        "OS permission revocations when user disables biometrics in phone settings"
      ]
    },
    {
      id: "US-02",
      epicId: "EPIC-01",
      title: "Secure Keystore / Keychain Token Encryption",
      asA: "security engineer",
      iWant: "refresh tokens encrypted inside Apple Keychain and Android Keystore",
      soThat: "session tokens cannot be extracted from rooted or compromised devices",
      acceptanceCriteria: [
        "Given a successful login, When storing credentials, Then encrypt the refresh token using AES-256-GCM backed by hardware secure enclave.",
        "Given biometric credentials change in OS settings, When app opens, Then invalidate previous encryption keys and force re-login."
      ],
      complexity: "L",
      dependsOn: ["US-01"],
      blocks: ["US-03"],
      technicalRisks: [
        "Key invalidation bugs on Android keystore upgrades"
      ]
    },
    {
      id: "US-03",
      epicId: "EPIC-01",
      title: "PIN / Password Fallback & Re-authentication Flow",
      asA: "mobile app user",
      iWant: "to authenticate using my master password or account PIN when biometrics fail",
      soThat: "I am never locked out of my account if sensor hardware fails or is disabled",
      acceptanceCriteria: [
        "Given biometric prompt is cancelled or sensor unavailable, When user taps 'Use Passcode', Then render master password challenge.",
        "Given valid password submitted, When verified by backend auth API, Then re-arm biometric prompt for subsequent sessions."
      ],
      complexity: "S",
      dependsOn: ["US-01", "US-02"],
      blocks: [],
      technicalRisks: [
        "Rate limiting brute-force PIN attempts locally"
      ]
    }
  ],
  mermaidDiagram: `graph TD
  US01["US-01: Biometric Hardware Prompt"] --> US02["US-02: Keystore/Keychain Encryption"]
  US01 --> US03["US-03: PIN / Password Fallback"]
  US02 --> US03
  classDef default fill:#18181b,stroke:#6366f1,stroke-width:2px,color:#f4f4f5;`
};
