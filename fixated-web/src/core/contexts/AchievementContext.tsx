import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useUserStats } from "./UserStatsContext";
import { Achievement, UserAchievement, AchievementType, Habit, DailyGoal } from "../types";
import { ACHIEVEMENTS } from "../constants";
import { collection, query, where, getDocs, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

interface AchievementContextType {
  userAchievements: UserAchievement[];
  unlockedAchievements: Achievement[];
  checkAchievements: () => Promise<void>;
  getAchievementProgress: (achievementId: string) => number;
  isAchievementUnlocked: (achievementId: string) => boolean;
  newlyUnlocked: Achievement | null;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error("useAchievements must be used within AchievementProvider");
  }
  return context;
};

export const AchievementProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  const { user, majorSkillGroups, refreshUserData, addExperience } = useUserStats();
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);

  const loadUserAchievements = useCallback(async () => {
    if (!currentUser) return;

    const achievementsQuery = query(
      collection(db, "userAchievements"),
      where("userId", "==", currentUser.uid)
    );
    const snapshot = await getDocs(achievementsQuery);
    const achievements = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      unlockedAt: doc.data().unlockedAt?.toDate()
    } as UserAchievement));
    setUserAchievements(achievements);
  }, [currentUser]);

  const loadHabits = useCallback(async () => {
    if (!currentUser) return;

    const habitsQuery = query(
      collection(db, "habits"),
      where("userId", "==", currentUser.uid)
    );
    const snapshot = await getDocs(habitsQuery);
    const habitsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      completedDates: doc.data().completedDates?.map((date: any) => date.toDate()) || []
    } as Habit));
    setHabits(habitsData);
  }, [currentUser]);

  const loadDailyGoals = useCallback(async () => {
    if (!currentUser) return;

    const goalsQuery = query(
      collection(db, "dailyGoals"),
      where("userId", "==", currentUser.uid)
    );
    const snapshot = await getDocs(goalsQuery);
    const goalsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date()
    } as DailyGoal));
    setDailyGoals(goalsData);
  }, [currentUser]);

  useEffect(() => {
    loadUserAchievements();
    loadHabits();
    loadDailyGoals();
  }, [loadUserAchievements, loadHabits, loadDailyGoals]);

  const checkAchievements = useCallback(async () => {
    if (!currentUser || !user) return;

    const calculateProgress = (achievement: Achievement): number => {
      if (!user) return 0;

      switch (achievement.type) {
        case AchievementType.LEVEL:
          return Math.min(user.level, achievement.requirement);
        case AchievementType.OVERALL_RATING:
          return Math.min(user.overallRating, achievement.requirement);
        case AchievementType.SKILL_RATING:
          const maxSkillRating = Math.max(
            ...majorSkillGroups.flatMap(group => group.skills.map(skill => skill.rating)),
            0
          );
          return Math.min(maxSkillRating, achievement.requirement);
        case AchievementType.STREAK:
          const maxStreak = habits.length > 0 
            ? Math.max(...habits.map(habit => habit.streak), 0)
            : 0;
          return Math.min(maxStreak, achievement.requirement);
        case AchievementType.HABIT_COMPLETION:
          const totalCompletions = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
          return Math.min(totalCompletions, achievement.requirement);
        case AchievementType.DAILY_GOAL:
          const completedGoals = dailyGoals.filter(goal => goal.completed).length;
          return Math.min(completedGoals, achievement.requirement);
        default:
          return 0;
      }
    };

    const newUnlocks: string[] = [];

    for (const achievement of ACHIEVEMENTS) {
      const progress = calculateProgress(achievement);
      const existingAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);

      if (progress >= achievement.requirement && !existingAchievement?.completed) {
        const userAchievementRef = doc(collection(db, "userAchievements"));
        const userAchievement: UserAchievement = {
          id: userAchievementRef.id,
          userId: currentUser.uid,
          achievementId: achievement.id,
          unlockedAt: new Date(),
          progress: achievement.requirement,
          completed: true
        };

        await setDoc(userAchievementRef, {
          ...userAchievement,
          unlockedAt: Timestamp.fromDate(userAchievement.unlockedAt)
        });

        await addExperience(achievement.experienceReward);
        newUnlocks.push(achievement.id);
        if (newUnlocks.length === 1) {
          setNewlyUnlocked(achievement);
          setTimeout(() => setNewlyUnlocked(null), 6000);
        }
      } else if (!existingAchievement && progress < achievement.requirement) {
        const userAchievementRef = doc(collection(db, "userAchievements"));
        const userAchievement: UserAchievement = {
          id: userAchievementRef.id,
          userId: currentUser.uid,
          achievementId: achievement.id,
          unlockedAt: new Date(),
          progress,
          completed: false
        };

        await setDoc(userAchievementRef, {
          ...userAchievement,
          unlockedAt: Timestamp.fromDate(userAchievement.unlockedAt)
        });
      } else if (existingAchievement && !existingAchievement.completed) {
        const userAchievementRef = doc(db, "userAchievements", existingAchievement.id);
        await setDoc(userAchievementRef, {
          progress,
          completed: progress >= achievement.requirement
        }, { merge: true });

        if (progress >= achievement.requirement && !existingAchievement.completed) {
          await addExperience(achievement.experienceReward);
          newUnlocks.push(achievement.id);
          if (newUnlocks.length === 1) {
            setNewlyUnlocked(achievement);
            setTimeout(() => setNewlyUnlocked(null), 6000);
          }
        }
      }
    }

    await loadUserAchievements();
    if (newUnlocks.length > 0) {
      await refreshUserData();
    }
  }, [currentUser, user, majorSkillGroups, userAchievements, habits, dailyGoals, addExperience, refreshUserData, loadUserAchievements]);

  useEffect(() => {
    if (user) {
      checkAchievements();
    }
  }, [user, majorSkillGroups, habits, dailyGoals, checkAchievements]);

  const getAchievementProgress = (achievementId: string): number => {
    if (!user) return 0;
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return 0;

    switch (achievement.type) {
      case AchievementType.LEVEL:
        return Math.min(user.level, achievement.requirement);
      case AchievementType.OVERALL_RATING:
        return Math.min(user.overallRating, achievement.requirement);
      case AchievementType.SKILL_RATING:
        const maxSkillRating = Math.max(
          ...majorSkillGroups.flatMap(group => group.skills.map(skill => skill.rating)),
          0
        );
        return Math.min(maxSkillRating, achievement.requirement);
      case AchievementType.STREAK:
        const maxStreakProgress = habits.length > 0 
          ? Math.max(...habits.map(habit => habit.streak), 0)
          : 0;
        return Math.min(maxStreakProgress, achievement.requirement);
      case AchievementType.HABIT_COMPLETION:
        const totalCompletions = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
        return Math.min(totalCompletions, achievement.requirement);
      case AchievementType.DAILY_GOAL:
        const completedGoals = dailyGoals.filter(goal => goal.completed).length;
        return Math.min(completedGoals, achievement.requirement);
      default:
        return 0;
    }
  };

  const isAchievementUnlocked = (achievementId: string): boolean => {
    const userAchievement = userAchievements.find(ua => ua.achievementId === achievementId);
    return userAchievement?.completed || false;
  };

  const unlockedAchievements = ACHIEVEMENTS.filter(achievement =>
    isAchievementUnlocked(achievement.id)
  );

  return (
    <AchievementContext.Provider value={{
      userAchievements,
      unlockedAchievements,
      checkAchievements,
      getAchievementProgress,
      isAchievementUnlocked,
      newlyUnlocked
    }}>
      {children}
    </AchievementContext.Provider>
  );
};
