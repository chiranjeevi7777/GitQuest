import type { Mission } from './mission';

export interface World {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  glowColor: string;
  missions: Mission[];
  unlockRequirement: string | null;
  position: { x: number; y: number };
}
