import {
  Palmtree,
  GraduationCap,
  Shield,
  Home,
  Gift,
  Target,
  type LucideIcon,
} from "lucide-react";

/** Maps a goal's `icon` key (from persona data) to a Lucide icon. */
export const GOAL_ICONS: Record<string, LucideIcon> = {
  palmtree: Palmtree,
  graduation: GraduationCap,
  shield: Shield,
  home: Home,
  gift: Gift,
};

export function goalIcon(key: string): LucideIcon {
  return GOAL_ICONS[key] ?? Target;
}
