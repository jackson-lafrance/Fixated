import { useState, useEffect } from "react";
import { useUserStats } from "../../core/contexts/UserStatsContext";
import { useAuth } from "../../core/contexts/AuthContext";
import { HabitCard } from "../../components/HabitCard";
import type { Habit } from "../../core/types";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../../core/firebase";
import "./HabitsView.css";

export const HabitsView = () => {
  const { currentUser } = useAuth();
  const { majorSkillGroups, addExperience, refreshUserData } = useUserStats();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitSkillId, setNewHabitSkillId] = useState("");
  const [newHabitFrequency, setNewHabitFrequency] = useState<"daily" | "weekly" | "custom">("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHabits();
  }, [currentUser]);

  const loadHabits = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const habitsQuery = query(collection(db, "habits"), where("userId", "==", currentUser.uid));
      const habitsSnapshot = await getDocs(habitsQuery);
      const loadedHabits = habitsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        completedDates: doc.data().completedDates?.map((d: Timestamp) => d.toDate()) || []
      } as Habit));
      setHabits(loadedHabits);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load habits");
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async () => {
    if (!currentUser || !newHabitName || !newHabitSkillId) return;

    try {
      setError("");
      const newHabit: Omit<Habit, "id"> = {
        userId: currentUser.uid,
        name: newHabitName,
        skillId: newHabitSkillId,
        frequency: newHabitFrequency,
        streak: 0,
        completedDates: [],
        createdAt: new Date()
      };

      await addDoc(collection(db, "habits"), {
        ...newHabit,
        createdAt: Timestamp.now()
      });

      setNewHabitName("");
      setNewHabitSkillId("");
      setShowAddForm(false);
      await loadHabits();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create habit");
    }
  };

  const handleCompleteHabit = async (habit: Habit) => {
    if (!currentUser) return;

    try {
      setError("");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isCompletedToday = habit.completedDates.some(
        date => {
          const dateObj = date instanceof Date ? date : new Date(date);
          dateObj.setHours(0, 0, 0, 0);
          return dateObj.getTime() === today.getTime();
        }
      );

      if (isCompletedToday) return;

      const updatedDates = [...habit.completedDates, today];
      
      // Calculate streak: find the most recent completed date before today
      const sortedDates = [...updatedDates]
        .map(d => {
          const dateObj = d instanceof Date ? d : new Date(d);
          dateObj.setHours(0, 0, 0, 0);
          return dateObj;
        })
        .sort((a, b) => b.getTime() - a.getTime());
      
      let newStreak = 1;
      let checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - 1);
      
      for (let i = 0; i < sortedDates.length; i++) {
        const dateToCheck = new Date(checkDate);
        dateToCheck.setHours(0, 0, 0, 0);
        const found = sortedDates.find(d => {
          const dCopy = new Date(d);
          dCopy.setHours(0, 0, 0, 0);
          return dCopy.getTime() === dateToCheck.getTime();
        });
        
        if (found) {
          newStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      await updateDoc(doc(db, "habits", habit.id), {
        completedDates: updatedDates.map(d => {
          const dateObj = d instanceof Date ? d : new Date(d);
          return Timestamp.fromDate(dateObj);
        }),
        streak: newStreak
      });

      await addExperience(50);
      await loadHabits();
      await refreshUserData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete habit");
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!currentUser) return;
    
    if (window.confirm("Are you sure you want to delete this habit?")) {
      try {
        setError("");
        await deleteDoc(doc(db, "habits", habitId));
        await loadHabits();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete habit");
      }
    }
  };

  const allSkills = majorSkillGroups.flatMap(group => group.skills);

  return (
    <div className="habitsViewContainer">
      <div className="habitsHeader">
        <h1 className="habitsTitle">Habits & Goals</h1>
        <button className="addHabitButton" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "+ Add Habit"}
        </button>
      </div>

      {error && (
        <div className="errorMessage">
          {error}
          <button onClick={() => setError("")} className="errorClose">×</button>
        </div>
      )}

      {showAddForm && (
        <div className="addHabitForm">
          <input
            type="text"
            placeholder="Habit name"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            className="habitInput"
          />
          <select
            value={newHabitSkillId}
            onChange={(e) => setNewHabitSkillId(e.target.value)}
            className="habitSelect"
          >
            <option value="">Select a skill</option>
            {allSkills.map(skill => (
              <option key={skill.id} value={skill.id}>{skill.name}</option>
            ))}
          </select>
          <select
            value={newHabitFrequency}
            onChange={(e) => setNewHabitFrequency(e.target.value as "daily" | "weekly" | "custom")}
            className="habitSelect"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>
          <button onClick={handleAddHabit} className="submitHabitButton">
            Create Habit
          </button>
        </div>
      )}

      {loading ? (
        <div className="loadingMessage">Loading habits...</div>
      ) : (
        <div className="habitsGrid">
          {habits.length === 0 ? (
            <div className="noHabits">No habits yet. Add your first habit to start tracking!</div>
          ) : (
            habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onComplete={() => handleCompleteHabit(habit)}
                onDelete={() => handleDeleteHabit(habit.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

