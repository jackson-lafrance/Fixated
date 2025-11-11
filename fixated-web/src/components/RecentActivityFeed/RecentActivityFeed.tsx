import { useUserStats } from "../../core/contexts/UserStatsContext";
import "./RecentActivityFeed.css";

export const RecentActivityFeed = () => {
  const { habits, dailyGoals, progressHistory } = useUserStats();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get recent activity (last 7 days)
  const activities: Array<{
    type: "habit" | "goal" | "progress";
    message: string;
    date: Date;
    icon: string;
  }> = [];

  // Add habit completions
  habits.forEach(habit => {
    habit.completedDates.forEach(date => {
      const habitDate = new Date(date);
      habitDate.setHours(0, 0, 0, 0);
      const daysAgo = Math.floor((today.getTime() - habitDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysAgo <= 7 && daysAgo >= 0) {
        activities.push({
          type: "habit",
          message: `Completed "${habit.name}"`,
          date: habitDate,
          icon: "✓"
        });
      }
    });
  });

  // Add goal completions
  dailyGoals.forEach(goal => {
    if (goal.completed) {
      const goalDate = new Date(goal.date);
      goalDate.setHours(0, 0, 0, 0);
      const daysAgo = Math.floor((today.getTime() - goalDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysAgo <= 7 && daysAgo >= 0) {
        activities.push({
          type: "goal",
          message: `Completed daily goal (+${goal.experienceGained || 50} XP)`,
          date: goalDate,
          icon: "🎯"
        });
      }
    }
  });

  // Add level ups from progress history
  progressHistory.forEach((progress, index) => {
    if (index > 0) {
      const prevProgress = progressHistory[index - 1];
      if (progress.level > prevProgress.level) {
        const progressDate = new Date(progress.date);
        progressDate.setHours(0, 0, 0, 0);
        const daysAgo = Math.floor((today.getTime() - progressDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysAgo <= 7 && daysAgo >= 0) {
          activities.push({
            type: "progress",
            message: `Leveled up to Level ${progress.level}!`,
            date: progressDate,
            icon: "⬆️"
          });
        }
      }
    }
  });

  // Sort by date (most recent first)
  activities.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Limit to 10 most recent
  const recentActivities = activities.slice(0, 10);

  const formatDate = (date: Date) => {
    const daysAgo = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysAgo === 0) return "Today";
    if (daysAgo === 1) return "Yesterday";
    return `${daysAgo} days ago`;
  };

  return (
    <div className="recentActivityFeed">
      <h3 className="widgetTitle">Recent Activity</h3>
      {recentActivities.length === 0 ? (
        <div className="noActivityMessage">
          No recent activity. Complete habits and goals to see your progress here!
        </div>
      ) : (
        <div className="activityList">
          {recentActivities.map((activity, index) => (
            <div key={index} className="activityItem">
              <div className="activityIcon">{activity.icon}</div>
              <div className="activityContent">
                <div className="activityMessage">{activity.message}</div>
                <div className="activityDate">{formatDate(activity.date)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

