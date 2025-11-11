import { SkillCategory, AchievementType, AchievementRarity, Achievement } from "./types";

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

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Reach level 5",
    type: AchievementType.LEVEL,
    rarity: AchievementRarity.COMMON,
    icon: "🎯",
    requirement: 5,
    experienceReward: 100
  },
  {
    id: "rising-star",
    name: "Rising Star",
    description: "Reach level 10",
    type: AchievementType.LEVEL,
    rarity: AchievementRarity.UNCOMMON,
    icon: "⭐",
    requirement: 10,
    experienceReward: 250
  },
  {
    id: "champion",
    name: "Champion",
    description: "Reach level 25",
    type: AchievementType.LEVEL,
    rarity: AchievementRarity.RARE,
    icon: "🏆",
    requirement: 25,
    experienceReward: 500
  },
  {
    id: "legend",
    name: "Legend",
    description: "Reach level 50",
    type: AchievementType.LEVEL,
    rarity: AchievementRarity.EPIC,
    icon: "👑",
    requirement: 50,
    experienceReward: 1000
  },
  {
    id: "immortal",
    name: "Immortal",
    description: "Reach level 100",
    type: AchievementType.LEVEL,
    rarity: AchievementRarity.LEGENDARY,
    icon: "💎",
    requirement: 100,
    experienceReward: 5000
  },
  {
    id: "on-fire",
    name: "On Fire",
    description: "Complete a 7 day streak",
    type: AchievementType.STREAK,
    rarity: AchievementRarity.COMMON,
    icon: "🔥",
    requirement: 7,
    experienceReward: 150
  },
  {
    id: "unstoppable",
    name: "Unstoppable",
    description: "Complete a 30 day streak",
    type: AchievementType.STREAK,
    rarity: AchievementRarity.UNCOMMON,
    icon: "💪",
    requirement: 30,
    experienceReward: 500
  },
  {
    id: "dedicated",
    name: "Dedicated",
    description: "Complete a 100 day streak",
    type: AchievementType.STREAK,
    rarity: AchievementRarity.RARE,
    icon: "🎖️",
    requirement: 100,
    experienceReward: 2000
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Reach 90 overall rating",
    type: AchievementType.OVERALL_RATING,
    rarity: AchievementRarity.EPIC,
    icon: "✨",
    requirement: 90,
    experienceReward: 1500
  },
  {
    id: "elite",
    name: "Elite",
    description: "Reach 95 overall rating",
    type: AchievementType.OVERALL_RATING,
    rarity: AchievementRarity.LEGENDARY,
    icon: "🌟",
    requirement: 95,
    experienceReward: 3000
  },
  {
    id: "skill-master",
    name: "Skill Master",
    description: "Reach 80 rating in any skill",
    type: AchievementType.SKILL_RATING,
    rarity: AchievementRarity.RARE,
    icon: "🎓",
    requirement: 80,
    experienceReward: 750
  },
  {
    id: "daily-warrior",
    name: "Daily Warrior",
    description: "Complete 10 daily goals",
    type: AchievementType.DAILY_GOAL,
    rarity: AchievementRarity.COMMON,
    icon: "⚔️",
    requirement: 10,
    experienceReward: 200
  },
  {
    id: "habit-former",
    name: "Habit Former",
    description: "Complete 50 habits",
    type: AchievementType.HABIT_COMPLETION,
    rarity: AchievementRarity.UNCOMMON,
    icon: "📝",
    requirement: 50,
    experienceReward: 400
  },
  {
    id: "consistency-king",
    name: "Consistency King",
    description: "Complete 500 habits",
    type: AchievementType.HABIT_COMPLETION,
    rarity: AchievementRarity.EPIC,
    icon: "👑",
    requirement: 500,
    experienceReward: 2500
  }
];

export const RARITY_COLORS = {
  [AchievementRarity.COMMON]: "#9CA3AF",
  [AchievementRarity.UNCOMMON]: "#10B981",
  [AchievementRarity.RARE]: "#3B82F6",
  [AchievementRarity.EPIC]: "#8B5CF6",
  [AchievementRarity.LEGENDARY]: "#F59E0B"
};

