import { useState } from "react";
import { useHabits } from "../../core/contexts/HabitsContext";
import { useUserStats } from "../../core/contexts/UserStatsContext";
import "./HabitsList.css";

export const HabitsList = () => {
  const { habits, loading, completeHabit, deleteHabit, isHabitCompletedToday, addHabit } = useHabits();
  const { majorSkillGroups } = useUserStats();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitSkillId, setNewHabitSkillId] = useState("");
  const [newHabitFrequency, setNewHabitFrequency] = useState<"daily" | "weekly" | "custom">("daily");

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim() || !newHabitSkillId) return;

    await addHabit(newHabitName.trim(), newHabitSkillId, newHabitFrequency);
    setNewHabitName("");
    setNewHabitSkillId("");
    setNewHabitFrequency("daily");
    setShowAddForm(false);
  };

  const getAllSkills = () => {
    const allSkills: { id: string; name: string; groupName: string }[] = [];
    majorSkillGroups.forEach(group => {
      group.skills.forEach(skill => {
        allSkills.push({ id: skill.id, name: skill.name, groupName: group.name });
      });
    });
    return allSkills;
  };

  const getSkillName = (skillId: string): string => {
    for (const group of majorSkillGroups) {
      const skill = group.skills.find(s => s.id === skillId);
      if (skill) return skill.name;
    }
    return "Unknown Skill";
  };

  const allSkills = getAllSkills();

  if (loading) {
    return (
      <div className="habitsContainer">
        <div className="loadingMessage">Loading habits...</div>
      </div>
    );
  }

  return (
    <div className="habitsContainer">
      <div className="habitsHeader">
        <h2 className="habitsTitle">My Habits</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="addHabitButton"
        >
          {showAddForm ? "Cancel" : "+ Add Habit"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddHabit} className="addHabitForm">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="Habit name (e.g., 'Run 5km', 'Read 30 minutes')"
            className="habitInput"
            required
          />
          {allSkills.length > 0 ? (
            <select
              value={newHabitSkillId}
              onChange={(e) => setNewHabitSkillId(e.target.value)}
              className="habitSelect"
              required
            >
              <option value="">Select a skill</option>
              {allSkills.map(skill => (
                <option key={skill.id} value={skill.id}>
                  {skill.name} ({skill.groupName})
                </option>
              ))}
            </select>
          ) : (
            <div className="noSkillsWarning">
              No skills available. Skills will be created automatically when you start tracking habits.
            </div>
          )}
          <select
            value={newHabitFrequency}
            onChange={(e) => setNewHabitFrequency(e.target.value as "daily" | "weekly" | "custom")}
            className="habitSelect"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>
          <button 
            type="submit" 
            className="submitHabitButton"
            disabled={allSkills.length === 0}
          >
            Add Habit
          </button>
        </form>
      )}

      {habits.length === 0 ? (
        <div className="noHabitsMessage">
          No habits yet. Add your first habit to start tracking your progress!
        </div>
      ) : (
        <div className="habitsList">
          {habits.map(habit => {
            const isCompleted = isHabitCompletedToday(habit);
            return (
              <div key={habit.id} className={`habitCard ${isCompleted ? "completed" : ""}`}>
                <div className="habitInfo">
                  <h3 className="habitName">{habit.name}</h3>
                  <p className="habitMeta">
                    {getSkillName(habit.skillId)} • {habit.frequency} • Streak: {habit.streak} 🔥
                  </p>
                </div>
                <div className="habitActions">
                  {!isCompleted && (
                    <button
                      onClick={() => completeHabit(habit.id)}
                      className="completeButton"
                    >
                      Complete
                    </button>
                  )}
                  {isCompleted && (
                    <span className="completedBadge">✓ Completed Today</span>
                  )}
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="deleteButton"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

