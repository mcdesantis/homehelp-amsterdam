export const APP_NAME = "HomeHelp Amsterdam";
export const PLATFORM_FEE_PERCENT = Number(process.env.PLATFORM_FEE_PERCENT ?? 12);
export const PILOT_CITY = process.env.PILOT_CITY ?? "Amsterdam";

export const SERVICES = [
  { slug: "cleaning", label: "Cleaning" },
  { slug: "housekeeping", label: "Housekeeping" },
  { slug: "electrical", label: "Electrical" },
  { slug: "plumbing", label: "Plumbing" },
  { slug: "moving", label: "Moving" }
] as const;
