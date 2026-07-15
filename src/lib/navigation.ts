export type ViewState = "HOME" | "PROJECTS" | "ABOUT" | "EXPERIENCE" | "CONTACT";

export type DirectionKey =
  | "arrowup"
  | "arrowdown"
  | "arrowleft"
  | "arrowright"
  | "w"
  | "a"
  | "s"
  | "d";

/** HOME: up/W → Projects, down/S → About, left/A → Experience, right/D → Contact */
const HOME_DIRECTION_MAP: Record<string, ViewState> = {
  arrowup: "PROJECTS",
  w: "PROJECTS",
  arrowdown: "ABOUT",
  s: "ABOUT",
  arrowleft: "EXPERIENCE",
  a: "EXPERIENCE",
  arrowright: "CONTACT",
  d: "CONTACT",
};

const RETURN_HOME_MAP: Partial<Record<ViewState, DirectionKey>> = {
  PROJECTS: "arrowdown",
  ABOUT: "arrowup",
  EXPERIENCE: "arrowright",
  CONTACT: "arrowleft",
};

export function resolveViewFromInput(current: ViewState, key: string): ViewState {
  const normalized = key.toLowerCase();

  if (current === "HOME") {
    return HOME_DIRECTION_MAP[normalized] ?? current;
  }

  const returnKey = RETURN_HOME_MAP[current];
  if (returnKey && normalized === returnKey) {
    return "HOME";
  }

  return current;
}

export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select" || tag === "button") {
    return true;
  }
  return target.isContentEditable;
}

export const SECTION_LABELS: Record<Exclude<ViewState, "HOME">, string> = {
  PROJECTS: "Projects",
  ABOUT: "About",
  EXPERIENCE: "Experience",
  CONTACT: "Contact",
};
