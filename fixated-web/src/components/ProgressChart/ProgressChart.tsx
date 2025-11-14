import { useUserStats } from "../../core/contexts/UserStatsContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./ProgressChart.css";

export const ProgressChart = () => {
  const { progressHistory, user } = useUserStats();

  if (!progressHistory || progressHistory.length === 0) {
    return (
      <div className="progressChartContainer">
        <h3 className="chartTitle">Progress Over Time</h3>
        <div className="noDataMessage">No progress data yet. Start tracking habits to see your progress!</div>
      </div>
    );
  }

  const chartData = progressHistory.map((data) => ({
    date: new Date(data.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    rating: data.overallRating,
    level: data.level,
    experience: data.experience
  }));

  return (
    <div className="progressChartContainer">
      <h3 className="chartTitle">Progress Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="rating" stroke="#667eea" strokeWidth={2} name="Overall Rating" />
          <Line type="monotone" dataKey="level" stroke="#764ba2" strokeWidth={2} name="Level" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

