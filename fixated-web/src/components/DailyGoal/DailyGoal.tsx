import { DailyGoal as DailyGoalType, Habit } from "../../core/types";
import "./DailyGoal.css";

interface DailyGoalProps {
  goal: DailyGoalType;
  habits: Habit[];
  onComplete: (goalId: string) => void;
  onCompleteHabit?: (goalId: string, habitId: string) => void;
  showProgress?: boolean;
}

export const DailyGoal = ({ goal, habits, onComplete, onCompleteHabit, showProgress = true }: DailyGoalProps) => {
  const formatDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const goalDate = new Date(date);
    goalDate.setHours(0, 0, 0, 0);
    
    if (goalDate.getTime() === today.getTime()) {
      return "Today";
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (goalDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    }
    
    return goalDate.toLocaleDateString("en-US", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  const handleComplete = () => {
    if (!goal.completed) {
      onComplete(goal.id);
    }
  };

  const handleHabitComplete = (habitId: string) => {
    if (onCompleteHabit && !goal.completed) {
      onCompleteHabit(goal.id, habitId);
    }
  };

  const completedHabitsCount = goal.completedHabits?.length || 0;
  const progressPercentage = goal.habits.length > 0 
    ? Math.round((completedHabitsCount / goal.habits.length) * 100) 
    : 0;

  const goalHabits = habits.filter(h => goal.habits.includes(h.id));

  return (
    <div className={`daily-goal ${goal.completed ? "completed" : ""}`}>
      <div className="daily-goal-header">
        <h3 className="daily-goal-date">{formatDate(goal.date)}</h3>
        {goal.completed && (
          <span className="daily-goal-badge">Completed</span>
        )}
      </div>
      {showProgress && !goal.completed && (
        <div className="daily-goal-progress">
          <div className="daily-goal-progress-bar">
            <div 
              className="daily-goal-progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="daily-goal-progress-text">
            {completedHabitsCount} / {goal.habits.length} habits completed
          </span>
        </div>
      )}
      <div className="daily-goal-content">
        {showProgress && goalHabits.length > 0 && (
          <div className="daily-goal-habits-checklist">
            {goalHabits.map(habit => {
              const isCompleted = goal.completedHabits?.includes(habit.id) || false;
              return (
                <label 
                  key={habit.id} 
                  className={`daily-goal-habit-item ${isCompleted ? "completed" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => handleHabitComplete(habit.id)}
                    disabled={goal.completed}
                    className="daily-goal-habit-checkbox"
                  />
                  <span className="daily-goal-habit-name">{habit.name}</span>
                </label>
              );
            })}
          </div>
        )}
        {!showProgress && (
          <p className="daily-goal-habits-count">
            {goal.habits.length} {goal.habits.length === 1 ? "habit" : "habits"} planned
          </p>
        )}
        {goal.completed && (
          <p className="daily-goal-experience">
            +{goal.experienceGained} XP gained
          </p>
        )}
      </div>
      {!goal.completed && !showProgress && (
        <button 
          className="daily-goal-complete-button"
          onClick={handleComplete}
        >
          Complete Goal
        </button>
      )}
    </div>
  );
};

