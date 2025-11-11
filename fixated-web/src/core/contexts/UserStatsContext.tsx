import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import type { User, Skill, MajorSkillGroup, ProgressData, Habit, DailyGoal } from "../types";
import { SkillCategory } from "../constants";
import { doc, getDoc, setDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

interface UserStatsContextType {
  user: User | null;
  majorSkillGroups: MajorSkillGroup[];
  progressHistory: ProgressData[];
  habits: Habit[];
  dailyGoals: DailyGoal[];
  todayGoal: DailyGoal | null;
  updateSkillRating: (skillId: string, newRating: number) => Promise<void>;
  addExperience: (amount: number) => Promise<void>;
  refreshUserData: () => Promise<void>;
  completeHabit: (habitId: string) => Promise<void>;
  completeDailyGoal: (goalId: string) => Promise<void>;
}

const UserStatsContext = createContext<UserStatsContextType | undefined>(undefined);

export const useUserStats = () => {
  const context = useContext(UserStatsContext);
  if (!context) {
    throw new Error("useUserStats must be used within UserStatsProvider");
  }
  return context;
};

export const UserStatsProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [majorSkillGroups, setMajorSkillGroups] = useState<MajorSkillGroup[]>([]);
  const [progressHistory, setProgressHistory] = useState<ProgressData[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [todayGoal, setTodayGoal] = useState<DailyGoal | null>(null);

  const loadUserData = async () => {
    if (!currentUser) return;

    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
    if (userDoc.exists()) {
      const userData = { id: userDoc.id, ...userDoc.data() } as User;
      setUser(userData);
    }

    const skillsQuery = query(collection(db, "skills"), where("userId", "==", currentUser.uid));
    const skillsSnapshot = await getDocs(skillsQuery);
    const skills = skillsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Skill));

    const groups: MajorSkillGroup[] = Object.values(SkillCategory).map((category: SkillCategory) => {
      const categorySkills = skills.filter(s => s.category === category);
      const overallRating = categorySkills.length > 0
        ? Math.round(categorySkills.reduce((sum, s) => sum + s.rating, 0) / categorySkills.length)
        : 50;

      return {
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        category,
        overallRating,
        skills: categorySkills
      };
    });

    setMajorSkillGroups(groups);

    const progressQuery = query(collection(db, "progress"), where("userId", "==", currentUser.uid));
    const progressSnapshot = await getDocs(progressQuery);
    const progress = progressSnapshot.docs.map(doc => ({
      ...doc.data(),
      date: doc.data().date.toDate()
    } as ProgressData));
    setProgressHistory(progress.sort((a, b) => a.date.getTime() - b.date.getTime()));

    // Load habits
    const habitsQuery = query(collection(db, "habits"), where("userId", "==", currentUser.uid));
    const habitsSnapshot = await getDocs(habitsQuery);
    const loadedHabits = habitsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        completedDates: data.completedDates?.map((d: Timestamp) => d.toDate()) || [],
        createdAt: data.createdAt?.toDate() || new Date()
      } as Habit;
    });
    setHabits(loadedHabits);

    // Load daily goals
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const goalsQuery = query(
      collection(db, "dailyGoals"),
      where("userId", "==", currentUser.uid)
    );
    const goalsSnapshot = await getDocs(goalsQuery);
    const loadedGoals = goalsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date()
      } as DailyGoal;
    });
    setDailyGoals(loadedGoals);

    // Find today's goal
    const todayGoalData = loadedGoals.find(goal => {
      const goalDate = new Date(goal.date);
      goalDate.setHours(0, 0, 0, 0);
      return goalDate.getTime() === today.getTime();
    });
    setTodayGoal(todayGoalData || null);
  };

  useEffect(() => {
    loadUserData();
  }, [currentUser]);

  const updateSkillRating = async (skillId: string, newRating: number) => {
    if (!currentUser || !user) return;

    const skillDoc = doc(db, "skills", skillId);
    await setDoc(skillDoc, { rating: newRating }, { merge: true });
    await loadUserData();
  };

  const addExperience = async (amount: number) => {
    if (!currentUser || !user) return;

    const newExperience = user.experience + amount;
    const newLevel = Math.floor(newExperience / 1000) + 1;
    
    const userDoc = doc(db, "users", currentUser.uid);
    await setDoc(userDoc, {
      experience: newExperience,
      level: newLevel
    }, { merge: true });
    
    await loadUserData();
  };

  const completeHabit = async (habitId: string) => {
    if (!currentUser) return;

    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isCompletedToday = habit.completedDates.some(
      date => new Date(date).setHours(0, 0, 0, 0) === today.getTime()
    );

    if (isCompletedToday) return;

    const updatedDates = [...habit.completedDates, today];
    const newStreak = habit.streak + 1;

    await setDoc(doc(db, "habits", habitId), {
      completedDates: updatedDates.map(d => Timestamp.fromDate(d)),
      streak: newStreak
    }, { merge: true });

    await addExperience(10); // Award XP for completing a habit
    await loadUserData();
  };

  const completeDailyGoal = async (goalId: string) => {
    if (!currentUser) return;

    await setDoc(doc(db, "dailyGoals", goalId), {
      completed: true
    }, { merge: true });

    const goal = dailyGoals.find(g => g.id === goalId);
    if (goal && !goal.completed) {
      await addExperience(goal.experienceGained || 50);
    }

    await loadUserData();
  };

  const refreshUserData = async () => {
    await loadUserData();
  };

  return (
    <UserStatsContext.Provider value={{
      user,
      majorSkillGroups,
      progressHistory,
      habits,
      dailyGoals,
      todayGoal,
      updateSkillRating,
      addExperience,
      refreshUserData,
      completeHabit,
      completeDailyGoal
    }}>
      {children}
    </UserStatsContext.Provider>
  );
};

