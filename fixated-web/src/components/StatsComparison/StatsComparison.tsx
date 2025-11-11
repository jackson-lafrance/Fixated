import { useUserStats } from "../../core/contexts/UserStatsContext";
import "./StatsComparison.css";

export const StatsComparison = () => {
  const { progressHistory, habits } = useUserStats();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayProgress = progressHistory.find(p => {
    const progressDate = new Date(p.date);
    progressDate.setHours(0, 0, 0, 0);
    return progressDate.getTime() === today.getTime();
  });

  const yesterdayProgress = progressHistory.find(p => {
    const progressDate = new Date(p.date);
    progressDate.setHours(0, 0, 0, 0);
    return progressDate.getTime() === yesterday.getTime();
  });

  const todayHabitsCompleted = habits.filter(habit => 
    habit.completedDates.some(date => {
      const habitDate = new Date(date);
      habitDate.setHours(0, 0, 0, 0);
      return habitDate.getTime() === today.getTime();
    })
  ).length;

  const yesterdayHabitsCompleted = habits.filter(habit => 
    habit.completedDates.some(date => {
      const habitDate = new Date(date);
      habitDate.setHours(0, 0, 0, 0);
      return habitDate.getTime() === yesterday.getTime();
    })
  ).length;

  const todayXP = todayProgress?.experience || 0;
  const yesterdayXP = yesterdayProgress?.experience || 0;
  const xpDiff = todayXP - yesterdayXP;

  const todayRating = todayProgress?.overallRating || 50;
  const yesterdayRating = yesterdayProgress?.overallRating || 50;
  const ratingDiff = todayRating - yesterdayRating;

  const habitsDiff = todayHabitsCompleted - yesterdayHabitsCompleted;

  const getChangeIndicator = (value: number) => {
    if (value > 0) return { icon: "↑", color: "#10b981", text: "+" + value };
    if (value < 0) return { icon: "↓", color: "#ef4444", text: value.toString() };
    return { icon: "→", color: "#666", text: "0" };
  };

  const comparisons = [
    {
      label: "Habits Completed",
      today: todayHabitsCompleted,
      yesterday: yesterdayHabitsCompleted,
      diff: habitsDiff
    },
    {
      label: "Overall Rating",
      today: todayRating,
      yesterday: yesterdayRating,
      diff: ratingDiff
    },
    {
      label: "Total Experience",
      today: todayXP,
      yesterday: yesterdayXP,
      diff: xpDiff
    }
  ];

  return (
    <div className="statsComparison">
      <h3 className="widgetTitle">Today vs Yesterday</h3>
      <div className="comparisonGrid">
        {comparisons.map((comp, index) => {
          const change = getChangeIndicator(comp.diff);
          return (
            <div key={index} className="comparisonCard">
              <div className="comparisonLabel">{comp.label}</div>
              <div className="comparisonValues">
                <div className="comparisonValue today">
                  <span className="valueLabel">Today</span>
                  <span className="valueNumber">{comp.today}</span>
                </div>
                <div className="comparisonArrow">
                  <span className="arrowIcon" style={{ color: change.color }}>
                    {change.icon}
                  </span>
                  <span className="arrowValue" style={{ color: change.color }}>
                    {change.text}
                  </span>
                </div>
                <div className="comparisonValue yesterday">
                  <span className="valueLabel">Yesterday</span>
                  <span className="valueNumber">{comp.yesterday}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

