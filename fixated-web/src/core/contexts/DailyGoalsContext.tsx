import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { DailyGoal, Habit } from "../types";
import { doc, getDoc, setDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

interface DailyGoalsContextType {
  todayGoal: DailyGoal | null;
  dailyGoals: DailyGoal[];
  habits: Habit[];
  loading: boolean;
  error: string | null;
  createTodayGoal: (habitIds: string[]) => Promise<void>;
  completeGoal: (goalId: string) => Promise<void>;
  completeHabitInGoal: (goalId: string, habitId: string) => Promise<void>;
  refreshGoals: () => Promise<void>;
}

const DailyGoalsContext = createContext<DailyGoalsContextType | undefined>(undefined);

export const useDailyGoals = () => {
  const context = useContext(DailyGoalsContext);
  if (!context) {
    throw new Error("useDailyGoals must be used within DailyGoalsProvider");
  }
  return context;
};

const getTodayDate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const calculateExperienceGained = (habitCount: number): number => {
  return habitCount * 50;
};

export const DailyGoalsProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  const [todayGoal, setTodayGoal] = useState<DailyGoal | null>(null);
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDailyGoals = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const habitsQuery = query(
        collection(db, "habits"),
        where("userId", "==", currentUser.uid)
      );
      const habitsSnapshot = await getDocs(habitsQuery);
      const loadedHabits = habitsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        completedDates: doc.data().completedDates?.map((d: Timestamp) => d.toDate()) || []
      } as Habit));
      setHabits(loadedHabits);

      const today = getTodayDate();
      const todayStart = Timestamp.fromDate(today);
      const todayEnd = Timestamp.fromDate(new Date(today.getTime() + 24 * 60 * 60 * 1000));

      const goalsQuery = query(
        collection(db, "dailyGoals"),
        where("userId", "==", currentUser.uid),
        where("date", ">=", todayStart),
        where("date", "<", todayEnd)
      );

      const goalsSnapshot = await getDocs(goalsQuery);
      
      if (!goalsSnapshot.empty) {
        const goalDoc = goalsSnapshot.docs[0];
        const goalData = {
          id: goalDoc.id,
          ...goalDoc.data(),
          date: goalDoc.data().date.toDate(),
          completedHabits: goalDoc.data().completedHabits || []
        } as DailyGoal;
        setTodayGoal(goalData);
      } else {
        setTodayGoal(null);
      }

      const allGoalsQuery = query(
        collection(db, "dailyGoals"),
        where("userId", "==", currentUser.uid)
      );
      const allGoalsSnapshot = await getDocs(allGoalsQuery);
      const allGoals = allGoalsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        completedHabits: doc.data().completedHabits || []
      } as DailyGoal));
      
      setDailyGoals(allGoals.sort((a, b) => b.date.getTime() - a.date.getTime()));
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load daily goals");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDailyGoals();
  }, [currentUser]);

  const createTodayGoal = async (habitIds: string[]) => {
    if (!currentUser) return;

    try {
      setError(null);
      const today = getTodayDate();

      const newGoal: Omit<DailyGoal, "id"> = {
        userId: currentUser.uid,
        date: today,
        habits: habitIds,
        completedHabits: [],
        completed: false,
        experienceGained: 0
      };

      const goalRef = doc(collection(db, "dailyGoals"));
      await setDoc(goalRef, {
        ...newGoal,
        date: Timestamp.fromDate(today)
      });

      const createdGoal: DailyGoal = {
        id: goalRef.id,
        ...newGoal
      };

      setTodayGoal(createdGoal);
      await loadDailyGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create daily goal");
      throw err;
    }
  };

  const completeGoal = async (goalId: string) => {
    if (!currentUser) return;

    try {
      setError(null);
      const goalDoc = doc(db, "dailyGoals", goalId);
      const goalSnapshot = await getDoc(goalDoc);
      
      if (!goalSnapshot.exists()) {
        throw new Error("Goal not found");
      }

      const goalData = goalSnapshot.data();
      const experienceGained = calculateExperienceGained(goalData.habits.length);

      await setDoc(goalDoc, {
        completed: true,
        experienceGained,
        completedHabits: goalData.habits
      }, { merge: true });

      await loadDailyGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete goal");
      throw err;
    }
  };

  const completeHabitInGoal = async (goalId: string, habitId: string) => {
    if (!currentUser) return;

    try {
      setError(null);
      const goalDoc = doc(db, "dailyGoals", goalId);
      const goalSnapshot = await getDoc(goalDoc);
      
      if (!goalSnapshot.exists()) {
        throw new Error("Goal not found");
      }

      const goalData = goalSnapshot.data();
      const completedHabits = goalData.completedHabits || [];
      
      if (completedHabits.includes(habitId)) {
        return;
      }

      const updatedCompletedHabits = [...completedHabits, habitId];
      const allHabitsCompleted = updatedCompletedHabits.length === goalData.habits.length;

      await setDoc(goalDoc, {
        completedHabits: updatedCompletedHabits,
        completed: allHabitsCompleted,
        experienceGained: allHabitsCompleted ? calculateExperienceGained(goalData.habits.length) : 0
      }, { merge: true });

      await loadDailyGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete habit");
      throw err;
    }
  };

  const refreshGoals = async () => {
    await loadDailyGoals();
  };

  return (
    <DailyGoalsContext.Provider value={{
      todayGoal,
      dailyGoals,
      habits,
      loading,
      error,
      createTodayGoal,
      completeGoal,
      completeHabitInGoal,
      refreshGoals
    }}>
      {children}
    </DailyGoalsContext.Provider>
  );
};

