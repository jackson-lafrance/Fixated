import { useState, useEffect } from "react";
import { useUserStats } from "../../core/contexts/UserStatsContext";
import { useAuth } from "../../core/contexts/AuthContext";
import { Navigation } from "../../components/Navigation";
import type { Habit } from "../../core/types";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../../core/firebase";
import "./HabitsView.css";

export const HabitsView = () => {
  const { currentUser } = useAuth();
  const { majorSkillGroups, addExperience, increaseSkillRating, refreshUserData } = useUserStats();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitSkillId, setNewHabitSkillId] = useState("");
  const [newHabitFrequency, setNewHabitFrequency] = useState<"daily" | "weekly" | "custom">("daily");

  useEffect(() => {
    loadHabits();
  }, [currentUser]);

  const loadHabits = async () => {
    if (!currentUser) return;

    const habitsQuery = query(collection(db, "habits"), where("userId", "==", currentUser.uid));
    const habitsSnapshot = await getDocs(habitsQuery);
    const loadedHabits = habitsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      completedDates: doc.data().completedDates?.map((d: Timestamp) => d.toDate()) || []
    } as Habit));
    setHabits(loadedHabits);
  };

  const handleAddHabit = async () => {
    if (!currentUser || !newHabitName || !newHabitSkillId) return;

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
  };

  const handleCompleteHabit = async (habit: Habit) => {
    if (!currentUser) return;

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
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const wasCompletedYesterday = habit.completedDates.some(
      date => date.toDateString() === yesterday.toDateString()
    );
    const newStreak = wasCompletedYesterday ? habit.streak + 1 : 1;

    await updateDoc(doc(db, "habits", habit.id), {
      completedDates: updatedDates.map(d => Timestamp.fromDate(d)),
      streak: newStreak
    });

    await addExperience(50);
    if (habit.skillId) {
      await increaseSkillRating(habit.skillId, 2);
    }
    await loadHabits();
    await refreshUserData();
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!currentUser) return;
    
    if (window.confirm("Are you sure you want to delete this habit?")) {
      await deleteDoc(doc(db, "habits", habitId));
      await loadHabits();
    }
  };

  const allSkills = majorSkillGroups.flatMap(group => group.skills);

  return (
    <div className="page">
      <Navigation />
      <div className="pageHeader">
        <h1 className="pageTitle">Habits</h1>
        <button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "+ Add Habit"}
        </button>
      </div>

      {showAddForm && (
        <div className="section">
          <h2>Add New Habit</h2>
          <div className="form">
            <input
              type="text"
              placeholder="Habit name"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
            />
            <select
              value={newHabitSkillId}
              onChange={(e) => setNewHabitSkillId(e.target.value)}
            >
              <option value="">Select a skill</option>
              {allSkills.map(skill => (
                <option key={skill.id} value={skill.id}>{skill.name}</option>
              ))}
            </select>
            <select
              value={newHabitFrequency}
              onChange={(e) => setNewHabitFrequency(e.target.value as "daily" | "weekly" | "custom")}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
            <button onClick={handleAddHabit}>Create Habit</button>
          </div>
        </div>
      )}

      <div className="section">
        <h2>Your Habits</h2>
        {habits.length === 0 ? (
          <p>No habits yet. Add your first habit to start tracking!</p>
        ) : (
          <div className="habitsList">
            {habits.map(habit => {
              const isCompletedToday = habit.completedDates.some(
                (date) => new Date(date).toDateString() === new Date().toDateString()
              );
              return (
                <div key={habit.id} className="habitItem">
                  <div>
                    <strong>{habit.name}</strong>
                    <div>Streak: {habit.streak} days</div>
                    <div>Frequency: {habit.frequency}</div>
                  </div>
                  <div>
                    {!isCompletedToday ? (
                      <button onClick={() => handleCompleteHabit(habit)}>Complete</button>
                    ) : (
                      <span>✓ Completed Today</span>
                    )}
                    <button onClick={() => handleDeleteHabit(habit.id)} style={{ marginLeft: "0.5rem" }}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
