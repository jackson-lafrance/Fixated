import { useState } from "react";
import { useDailyGoals } from "../../core/contexts/DailyGoalsContext";
import { useUserStats } from "../../core/contexts/UserStatsContext";
import { DailyGoal } from "../../components/DailyGoal";
import { HabitSelector } from "../../components/HabitSelector";
import "./DailyGoals.css";

export const DailyGoalsView = () => {
  const { todayGoal, dailyGoals, habits, loading, error, createTodayGoal, completeGoal, completeHabitInGoal } = useDailyGoals();
  const { addExperience } = useUserStats();
  const [selectedHabitIds, setSelectedHabitIds] = useState<string[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateGoal = async () => {
    if (selectedHabitIds.length === 0) return;
    try {
      await createTodayGoal(selectedHabitIds);
      setSelectedHabitIds([]);
      setShowCreateForm(false);
      setSuccessMessage("Daily goal created successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Failed to create goal:", err);
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    const goalToComplete = goalId === todayGoal?.id ? todayGoal : dailyGoals.find(g => g.id === goalId);
    if (!goalToComplete || goalToComplete.completed) return;
    
    try {
      const experienceGained = goalToComplete.habits.length * 50;
      await completeGoal(goalId);
      await addExperience(experienceGained);
      setSuccessMessage(`Goal completed! Gained ${experienceGained} XP`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Failed to complete goal:", err);
    }
  };

  const handleCompleteHabit = async (goalId: string, habitId: string) => {
    try {
      await completeHabitInGoal(goalId, habitId);
      const goal = goalId === todayGoal?.id ? todayGoal : dailyGoals.find(g => g.id === goalId);
      if (goal) {
        const allCompleted = (goal.completedHabits?.length || 0) + 1 === goal.habits.length;
        if (allCompleted) {
          const experienceGained = goal.habits.length * 50;
          await addExperience(experienceGained);
          setSuccessMessage(`All habits completed! Gained ${experienceGained} XP`);
          setTimeout(() => setSuccessMessage(null), 3000);
        }
      }
    } catch (err) {
      console.error("Failed to complete habit:", err);
    }
  };

  const completedGoalsCount = dailyGoals.filter(g => g.completed).length;
  const totalGoalsCount = dailyGoals.length;
  const completionRate = totalGoalsCount > 0 ? Math.round((completedGoalsCount / totalGoalsCount) * 100) : 0;

  if (loading) {
    return (
      <div className="daily-goals-container">
        <div className="daily-goals-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="daily-goals-container">
      <div className="daily-goals-header">
        <div>
          <h1 className="daily-goals-title">Daily Goals</h1>
          {totalGoalsCount > 0 && (
            <p className="daily-goals-stats">
              {completionRate}% completion rate ({completedGoalsCount}/{totalGoalsCount} goals)
            </p>
          )}
        </div>
        {!todayGoal && !showCreateForm && (
          <button 
            className="daily-goals-create-button"
            onClick={() => setShowCreateForm(true)}
          >
            Create Today's Goal
          </button>
        )}
      </div>

      {error && (
        <div className="daily-goals-error">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="daily-goals-success">
          {successMessage}
        </div>
      )}

      {showCreateForm && !todayGoal && (
        <div className="daily-goals-create-section">
          <HabitSelector
            habits={habits}
            selectedHabitIds={selectedHabitIds}
            onSelectionChange={setSelectedHabitIds}
          />
          <div className="daily-goals-create-actions">
            <button
              className="daily-goals-cancel-button"
              onClick={() => {
                setShowCreateForm(false);
                setSelectedHabitIds([]);
              }}
            >
              Cancel
            </button>
            <button
              className="daily-goals-submit-button"
              onClick={handleCreateGoal}
              disabled={selectedHabitIds.length === 0}
            >
              Create Goal ({selectedHabitIds.length} {selectedHabitIds.length === 1 ? "habit" : "habits"})
            </button>
          </div>
        </div>
      )}

      {todayGoal && (
        <div className="daily-goals-today">
          <h2 className="daily-goals-section-title">Today's Goal</h2>
          <DailyGoal 
            goal={todayGoal} 
            habits={habits}
            onComplete={handleCompleteGoal}
            onCompleteHabit={handleCompleteHabit}
            showProgress={true}
          />
        </div>
      )}

      {dailyGoals.length > 0 && (
        <div className="daily-goals-history">
          <h2 className="daily-goals-section-title">Previous Goals</h2>
          {dailyGoals
            .filter(goal => goal.id !== todayGoal?.id)
            .slice(0, 10)
            .map(goal => (
              <DailyGoal 
                key={goal.id} 
                goal={goal} 
                habits={habits}
                onComplete={handleCompleteGoal}
                showProgress={false}
              />
            ))}
        </div>
      )}
    </div>
  );
};

