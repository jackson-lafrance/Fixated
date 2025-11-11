import type { Habit } from "../../core/types";
import "./HabitCard.css";

interface HabitCardProps {
  habit: Habit;
  onComplete?: () => void;
  onDelete?: () => void;
}

export const HabitCard = ({ habit, onComplete, onDelete }: HabitCardProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isCompletedToday = habit.completedDates.some(
    (date) => {
      const dateObj = date instanceof Date ? date : new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      return dateObj.getTime() === today.getTime();
    }
  );

  return (
    <div className={`habitCard ${isCompletedToday ? "completed" : ""}`}>
      <div className="habitHeader">
        <h3 className="habitName">{habit.name}</h3>
        <div className="habitHeaderRight">
          <div className="habitStreak">🔥 {habit.streak}</div>
          {onDelete && (
            <button 
              className="habitDeleteButton" 
              onClick={onDelete}
              aria-label="Delete habit"
            >
              ×
            </button>
          )}
        </div>
      </div>
      <div className="habitFrequency">{habit.frequency}</div>
      {!isCompletedToday && (
        <button className="habitCompleteButton" onClick={onComplete}>
          Complete
        </button>
      )}
      {isCompletedToday && (
        <div className="habitCompleted">✓ Completed Today</div>
      )}
    </div>
  );
};

