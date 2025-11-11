import { useState } from "react";
import { Habit } from "../../core/types";
import "./HabitSelector.css";

interface HabitSelectorProps {
  habits: Habit[];
  selectedHabitIds: string[];
  onSelectionChange: (habitIds: string[]) => void;
}

export const HabitSelector = ({ habits, selectedHabitIds, onSelectionChange }: HabitSelectorProps) => {
  const handleHabitToggle = (habitId: string) => {
    if (selectedHabitIds.includes(habitId)) {
      onSelectionChange(selectedHabitIds.filter(id => id !== habitId));
    } else {
      onSelectionChange([...selectedHabitIds, habitId]);
    }
  };

  if (habits.length === 0) {
    return (
      <div className="habit-selector-empty">
        <p>No habits available. Create habits first to set daily goals.</p>
      </div>
    );
  }

  return (
    <div className="habit-selector">
      <h3 className="habit-selector-title">Select Habits for Today</h3>
      <div className="habit-selector-list">
        {habits.map(habit => (
          <label 
            key={habit.id} 
            className={`habit-selector-item ${selectedHabitIds.includes(habit.id) ? "selected" : ""}`}
          >
            <input
              type="checkbox"
              checked={selectedHabitIds.includes(habit.id)}
              onChange={() => handleHabitToggle(habit.id)}
              className="habit-selector-checkbox"
            />
            <span className="habit-selector-name">{habit.name}</span>
            {habit.streak > 0 && (
              <span className="habit-selector-streak">🔥 {habit.streak}</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

