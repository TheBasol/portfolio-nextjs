export type BootPhase =
  | "loading"
  | "ready"
  | "bootFlash"
  | "brand"
  | "falling"
  | "idle";

export const BOOT_PRE_FALL_PHASES: BootPhase[] = [
  "loading",
  "ready",
  "bootFlash",
  "brand",
];

export function isBootPreFall(phase: BootPhase): boolean {
  return BOOT_PRE_FALL_PHASES.includes(phase);
}
