import { useUserStats } from "../../core/contexts/UserStatsContext";
import { HabitCard } from "../HabitCard";
import "./DailyGoalsWidget.css";

export const DailyGoalsWidget = () => {
  const { todayGoal, habits, completeDailyGoal, completeHabit } = useUserStats();

  if (!todayGoal) {
    return (
      <div className="dailyGoalsWidget">
        <h3 className="widgetTitle">Today's Goals</h3>
        <div className="noGoalsMessage">
          No goals set for today. Create a daily goal to get started!
        </div>
      </div>
    );
  }

  const goalHabits = habits.filter(habit => todayGoal.habits.includes(habit.id));
  const completedHabits = goalHabits.filter(habit => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return habit.completedDates.some(date => {
      const habitDate = new Date(date);
      habitDate.setHours(0, 0, 0, 0);
      return habitDate.getTime() === today.getTime();
    });
  });

  const progress = goalHabits.length > 0 ? (completedHabits.length / goalHabits.length) * 100 : 0;

  const handleCompleteGoal = async () => {
    if (!todayGoal.completed) {
      await completeDailyGoal(todayGoal.id);
    }
  };

  return (
    <div className="dailyGoalsWidget">
      <div className="widgetHeader">
        <h3 className="widgetTitle">Today's Goals</h3>
        <div className="goalProgress">
          {completedHabits.length} / {goalHabits.length} completed
        </div>
      </div>
      <div className="goalProgressBar">
        <div 
          className="goalProgressFill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="goalHabitsList">
        {goalHabits.length === 0 ? (
          <div className="noHabitsMessage">No habits assigned to this goal</div>
        ) : (
          goalHabits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onComplete={() => completeHabit(habit.id)}
            />
          ))
        )}
      </div>
      {!todayGoal.completed && goalHabits.length > 0 && completedHabits.length === goalHabits.length && (
        <button className="completeGoalButton" onClick={handleCompleteGoal}>
          Complete Daily Goal (+{todayGoal.experienceGained || 50} XP)
        </button>
      )}
      {todayGoal.completed && (
        <div className="goalCompletedBadge">
          ✓ Goal Completed! +{todayGoal.experienceGained || 50} XP
        </div>
      )}
    </div>
  );
};

