import { SkillCategory } from "./types";

export const SKILL_LIBRARY = {
  [SkillCategory.PHYSICAL]: [
    { id: "strength", name: "Strength", baseRating: 50 },
    { id: "endurance", name: "Endurance", baseRating: 50 },
    { id: "flexibility", name: "Flexibility", baseRating: 50 },
    { id: "running", name: "Running", baseRating: 50 },
    { id: "lifting", name: "Lifting", baseRating: 50 },
    { id: "yoga", name: "Yoga", baseRating: 50 },
    { id: "swimming", name: "Swimming", baseRating: 50 },
    { id: "cycling", name: "Cycling", baseRating: 50 }
  ],
  [SkillCategory.MENTAL]: [
    { id: "intelligence", name: "Intelligence", baseRating: 50 },
    { id: "reading", name: "Reading", baseRating: 50 },
    { id: "math", name: "Math", baseRating: 50 },
    { id: "history", name: "History", baseRating: 50 },
    { id: "geography", name: "Geography", baseRating: 50 },
    { id: "science", name: "Science", baseRating: 50 },
    { id: "meditation", name: "Meditation", baseRating: 50 },
    { id: "memory", name: "Memory", baseRating: 50 },
    { id: "problemSolving", name: "Problem Solving", baseRating: 50 }
  ],
  [SkillCategory.CREATIVE]: [
    { id: "writing", name: "Writing", baseRating: 50 },
    { id: "music", name: "Music", baseRating: 50 },
    { id: "art", name: "Art", baseRating: 50 },
    { id: "design", name: "Design", baseRating: 50 },
    { id: "photography", name: "Photography", baseRating: 50 }
  ],
  [SkillCategory.SOCIAL]: [
    { id: "communication", name: "Communication", baseRating: 50 },
    { id: "leadership", name: "Leadership", baseRating: 50 },
    { id: "networking", name: "Networking", baseRating: 50 }
  ],
  [SkillCategory.PRODUCTIVITY]: [
    { id: "timeManagement", name: "Time Management", baseRating: 50 },
    { id: "organization", name: "Organization", baseRating: 50 },
    { id: "focus", name: "Focus", baseRating: 50 },
    { id: "planning", name: "Planning", baseRating: 50 }
  ]
};

export const EXPERIENCE_PER_LEVEL = 1000;
export const MAX_RATING = 100;
export const MIN_RATING = 0;

