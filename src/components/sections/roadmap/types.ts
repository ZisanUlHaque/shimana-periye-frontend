import type { ReactNode } from "react";

/**
 * One stop on the roadmap.
 *
 * `icon` is a ReactNode (e.g. `<Compass />`) rather than a component reference so
 * milestone data can live in a Server Component and still be passed to the
 * client-side <Roadmap /> (functions cannot cross the server/client boundary).
 */
export type RoadmapMilestone = {
  /** Stable key. */
  id: string;
  title: string;
  description: string;
  /** Short badge, e.g. "Weeks 1–2", "Jan 2027", "Phase 1". Optional. */
  date?: string;
  /** Marker icon, e.g. `<GraduationCap />`. Falls back to a pin. */
  icon?: ReactNode;
  /** Small chips shown under the description. */
  tags?: string[];
};

export type RoadmapProps = {
  milestones: RoadmapMilestone[];
  /** Small pill above the heading. Pass `null` to hide. */
  eyebrow?: string | null;
  /** Section heading. Pass `null` to hide the whole header. */
  title?: string | null;
  description?: string | null;
  /** Rendered after the last milestone (e.g. a call-to-action). */
  footer?: ReactNode;
  /** Called when the plane passes a milestone. `-1` means none reached yet. */
  onActiveChange?: (index: number, milestone: RoadmapMilestone | undefined) => void;
  /** Accessible label for the whole roadmap list. */
  ariaLabel?: string;
  className?: string;
};
