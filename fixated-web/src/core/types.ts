export interface User {
  id: string;
  email: string;
  displayName: string;
  level: number;
  experience: number;
  overallRating: number;
  createdAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  rating: number;
  experience: number;
  level: number;
}

export enum SkillCategory {
  PHYSICAL = "physical",
  MENTAL = "mental",
  CREATIVE = "creative",
  SOCIAL = "social",
  PRODUCTIVITY = "productivity"
}

export interface MajorSkillGroup {
  id: string;
  name: string;
  category: SkillCategory;
  overallRating: number;
  skills: Skill[];
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  skillId: string;
  frequency: "daily" | "weekly" | "custom";
  streak: number;
  completedDates: Date[];
  createdAt: Date;
}

export interface DailyGoal {
  id: string;
  userId: string;
  date: Date;
  habits: string[];
  completed: boolean;
  experienceGained: number;
}

export interface ProgressData {
  date: Date;
  overallRating: number;
  experience: number;
  level: number;
  skillRatings: Record<string, number>;
}
