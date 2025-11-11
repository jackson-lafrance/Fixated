import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Habit, Skill } from "../types";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

interface HabitsContextType {
  habits: Habit[];
  loading: boolean;
  addHabit: (name: string, skillId: string, frequency: "daily" | "weekly" | "custom") => Promise<void>;
  completeHabit: (habitId: string) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  refreshHabits: () => Promise<void>;
  isHabitCompletedToday: (habit: Habit) => boolean;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error("useHabits must be used within HabitsProvider");
  }
  return context;
};

export const HabitsProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHabits = async () => {
    if (!currentUser) {
      setHabits([]);
      setLoading(false);
      return;
    }

    try {
      const habitsQuery = query(collection(db, "habits"), where("userId", "==", currentUser.uid));
      const habitsSnapshot = await getDocs(habitsQuery);
      const loadedHabits = habitsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          completedDates: data.completedDates?.map((d: any) => d?.toDate ? d.toDate() : new Date(d)) || [],
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        } as Habit;
      });
      setHabits(loadedHabits);
    } catch (error) {
      console.error("Error loading habits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, [currentUser]);

  const addHabit = async (name: string, skillId: string, frequency: "daily" | "weekly" | "custom") => {
    if (!currentUser) return;

    const newHabit = {
      userId: currentUser.uid,
      name,
      skillId,
      frequency,
      streak: 0,
      completedDates: [],
      createdAt: Timestamp.now()
    };

    await addDoc(collection(db, "habits"), newHabit);
    await loadHabits();
  };

  const completeHabit = async (habitId: string) => {
    if (!currentUser) return;

    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isAlreadyCompleted = habit.completedDates.some(date => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });

    if (isAlreadyCompleted) return;

    const updatedCompletedDates = [...habit.completedDates, today];
    
    // Calculate streak
    const sortedDates = updatedCompletedDates
      .map(d => new Date(d).getTime())
      .sort((a, b) => b - a);
    
    let streak = 0;
    let currentDate = today.getTime();
    for (const date of sortedDates) {
      const daysDiff = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
      if (daysDiff === streak) {
        streak++;
        currentDate = date;
      } else {
        break;
      }
    }

    const habitRef = doc(db, "habits", habitId);
    await updateDoc(habitRef, {
      completedDates: updatedCompletedDates.map(d => Timestamp.fromDate(new Date(d))),
      streak
    });

    await loadHabits();
  };

  const deleteHabit = async (habitId: string) => {
    if (!currentUser) return;

    await deleteDoc(doc(db, "habits", habitId));
    await loadHabits();
  };

  const refreshHabits = async () => {
    await loadHabits();
  };

  const isHabitCompletedToday = (habit: Habit): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return habit.completedDates.some(date => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });
  };

  return (
    <HabitsContext.Provider value={{
      habits,
      loading,
      addHabit,
      completeHabit,
      deleteHabit,
      refreshHabits,
      isHabitCompletedToday
    }}>
      {children}
    </HabitsContext.Provider>
  );
};

