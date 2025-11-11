import { useUserStats } from "../../core/contexts/UserStatsContext";
import "./QuickStatsCards.css";

export const QuickStatsCards = () => {
  const { habits, progressHistory } = useUserStats();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate habits completed today
  const habitsCompletedToday = habits.filter(habit => 
    habit.completedDates.some(date => {
      const habitDate = new Date(date);
      habitDate.setHours(0, 0, 0, 0);
      return habitDate.getTime() === today.getTime();
    })
  ).length;

  // Calculate total streaks
  const totalStreaks = habits.reduce((sum, habit) => sum + habit.streak, 0);
  const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

  // Calculate XP gained today (from progress history)
  const todayProgress = progressHistory.find(p => {
    const progressDate = new Date(p.date);
    progressDate.setHours(0, 0, 0, 0);
    return progressDate.getTime() === today.getTime();
  });
  const yesterdayProgress = progressHistory.find(p => {
    const progressDate = new Date(p.date);
    progressDate.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return progressDate.getTime() === yesterday.getTime();
  });
  const xpGainedToday = todayProgress && yesterdayProgress 
    ? todayProgress.experience - yesterdayProgress.experience 
    : 0;

  const stats = [
    {
      label: "Habits Completed",
      value: habitsCompletedToday,
      total: habits.length,
      icon: "✓",
      color: "#667eea"
    },
    {
      label: "Longest Streak",
      value: longestStreak,
      unit: " days",
      icon: "🔥",
      color: "#f59e0b"
    },
    {
      label: "XP Gained Today",
      value: xpGainedToday,
      icon: "⭐",
      color: "#10b981"
    },
    {
      label: "Total Streaks",
      value: totalStreaks,
      icon: "📊",
      color: "#8b5cf6"
    }
  ];

  return (
    <div className="quickStatsContainer">
      {stats.map((stat, index) => (
        <div key={index} className="quickStatCard" style={{ borderTopColor: stat.color }}>
          <div className="quickStatIcon" style={{ color: stat.color }}>
            {stat.icon}
          </div>
          <div className="quickStatContent">
            <div className="quickStatValue">
              {stat.value}
              {stat.unit || (stat.total ? ` / ${stat.total}` : "")}
            </div>
            <div className="quickStatLabel">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

