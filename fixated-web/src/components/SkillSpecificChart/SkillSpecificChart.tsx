import { useUserStats } from "../../core/contexts/UserStatsContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./SkillSpecificChart.css";

export const SkillSpecificChart = () => {
  const { progressHistory, majorSkillGroups } = useUserStats();

  if (!progressHistory || progressHistory.length === 0) {
    return (
      <div className="chartContainer">
        <h3 className="chartTitle">Skill Category Progress</h3>
        <div className="noDataMessage">No progress data yet. Start tracking to see skill progress!</div>
      </div>
    );
  }

  // Prepare data for each skill category
  const chartData = progressHistory.map((data) => {
    const date = data.date instanceof Date 
      ? data.date 
      : typeof data.date === 'string' 
        ? new Date(data.date) 
        : (data.date as any)?.toDate?.() || new Date();
    
    const dataPoint: Record<string, string | number> = {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    };

    // Add each skill category rating
    majorSkillGroups.forEach(group => {
      if (data.skillRatings && data.skillRatings[group.id]) {
        dataPoint[group.name] = data.skillRatings[group.id];
      } else {
        // Use overall rating as fallback if specific skill rating not available
        dataPoint[group.name] = group.overallRating;
      }
    });

    return dataPoint;
  });

  const colors = ['#667eea', '#764ba2', '#48bb78', '#f59e0b', '#ef4444', '#8b5cf6'];
  const skillGroupsToShow = majorSkillGroups.filter(group => 
    chartData.some(d => d[group.name] !== undefined)
  );

  if (skillGroupsToShow.length === 0) {
    return (
      <div className="chartContainer">
        <h3 className="chartTitle">Skill Category Progress</h3>
        <div className="noDataMessage">No skill-specific data available yet.</div>
      </div>
    );
  }

  return (
    <div className="chartContainer">
      <h3 className="chartTitle">Skill Category Progress Over Time</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          {skillGroupsToShow.map((group, index) => (
            <Line
              key={group.id}
              type="monotone"
              dataKey={group.name}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

