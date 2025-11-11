import { ProgressData } from "../../core/types";
import "./StatsOverview.css";

interface StatsOverviewProps {
  progressHistory: ProgressData[];
  totalSkills: number;
}

const StatsOverview = ({ progressHistory, totalSkills }: StatsOverviewProps) => {
  const totalDaysTracked = progressHistory.length;
  const averageRating = progressHistory.length > 0
    ? Math.round(progressHistory.reduce((sum, p) => sum + p.overallRating, 0) / progressHistory.length)
    : 0;
  
  const highestRating = progressHistory.length > 0
    ? Math.max(...progressHistory.map(p => p.overallRating))
    : 0;

  const stats = [
    { label: "Total Skills", value: totalSkills, icon: "⭐" },
    { label: "Days Tracked", value: totalDaysTracked, icon: "📅" },
    { label: "Avg Rating", value: averageRating, icon: "📊" },
    { label: "Peak Rating", value: highestRating, icon: "🏆" }
  ];

  return (
    <div className="statsOverview">
      {stats.map((stat, index) => (
        <div key={index} className="statCard">
          <div className="statIcon">{stat.icon}</div>
          <div className="statContent">
            <div className="statValue">{stat.value}</div>
            <div className="statLabel">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;

