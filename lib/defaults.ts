import type { Settings } from "@/types";

export const DEFAULT_SETTINGS: Settings = {
  speed: 40,
  fontSize: 48,
  lineHeight: 1.5,
  textWidth: 12,
  mirrorHorizontal: false,
  mirrorVertical: false,
  textColor: "#ffffff",
  backgroundColor: "#000000",
  showReadingGuide: true,
  guideColor: "#5eead4",
  guidePosition: 33,
  guideHeight: 64,
  countdownEnabled: true,
  voiceFollowEnabled: false,
};

/** Merge stored settings with defaults so new fields work after upgrades. */
export function mergeSettings(partial?: Partial<Settings> | null): Settings {
  return { ...DEFAULT_SETTINGS, ...(partial ?? {}) };
}

export const DEFAULT_SCRIPT = `আসসালামু আলাইকুম। স্বাগতম আপনাদের।
আমি আপনাদের সাথে, এখন চলছে আজকের প্রধান সংবাদ।

প্রথমে রাজধানী থেকে। সিটি করপোরেশন আগামী পাঁচ বছরে সেতু মেরামত ও গণপরিবহন সম্প্রসারণে বড় অবকাঠামো প্রকল্প ঘোষণা করেছে। কর্মকর্তারা বলছেন, যানজট কমাতে এটি গুরুত্বপূর্ণ পদক্ষেপ হবে।

---

জাতীয় পর্যায়ে আজ শেয়ারবাজারে মিশ্র প্রবণতা দেখা গেছে। নতুন কর্মসংস্থান তথ্য ও সুদের হার নিয়ে বিনিয়োগকারীদের উদ্বেগের মধ্যে বাজার বন্ধ হয়েছে। বিশ্লেষকরা বলছেন, আগামী কয়েক সপ্তাহ ভোক্তা আস্থার জন্য গুরুত্বপূর্ণ।

[pause 2s]

আন্তর্জাতিক খবরে, বাণিজ্য ও আঞ্চলিক নিরাপত্তা নিয়ে কূটনীতিকদের দ্বিতীয় দিনের আলোচনা চলছে। এ বিষয়ে বিস্তারিত প্রতিবেদন থাকছে এই ঘণ্টায়ই।

থাকুন আমাদের সঙ্গে। বিরতির পর আবহাওয়া ও খেলাধুলার খবর।`;

export const STORAGE_KEYS = {
  script: "teleprompter:script",
  settings: "teleprompter:settings",
  scripts: "teleprompter:scripts",
  activeScriptId: "teleprompter:active-script-id",
} as const;

export const BROADCAST_CHANNEL = "teleprompter-remote";

/** Words per minute estimate used for reading-time display (editor). */
export const WORDS_PER_MINUTE = 150;

/** Speed change step for keyboard shortcuts (px/s). */
export const SPEED_STEP = 5;

/** Font size change step for keyboard shortcuts (px). */
export const FONT_SIZE_STEP = 4;

export const FONT_SIZE_MIN = 24;
export const FONT_SIZE_MAX = 120;
export const SPEED_MIN = 5;
export const SPEED_MAX = 200;
