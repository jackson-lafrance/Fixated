import type { Habit } from "../../core/types";
import "./HabitCard.css";

interface HabitCardProps {
  habit: Habit;
  onComplete?: () => void;
}

export const HabitCard = ({ habit, onComplete }: HabitCardProps) => {
  const isCompletedToday = habit.completedDates.some(
    (date) => new Date(date).toDateString() === new Date().toDateString()
  );

  return (
    <div className={`habitCard ${isCompletedToday ? "completed" : ""}`}>
      <div className="habitHeader">
        <h3 className="habitName">{habit.name}</h3>
        <div className="habitStreak">🔥 {habit.streak}</div>
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

