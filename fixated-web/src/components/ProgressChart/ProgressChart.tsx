import { useUserStats } from "../../core/contexts/UserStatsContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
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

  const chartData = progressHistory.map((data) => {
    const date = data.date instanceof Date 
      ? data.date 
      : typeof data.date === 'string' 
        ? new Date(data.date) 
        : (data.date as any)?.toDate?.() || new Date();
    
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    rating: data.overallRating,
    level: data.level,
    experience: data.experience
    };
  });

  return (
    <div className="progressChartContainer">
      <h3 className="chartTitle">Progress Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="rating" 
            stroke="#667eea" 
            strokeWidth={2} 
            name="Overall Rating"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="level" 
            stroke="#764ba2" 
            strokeWidth={2} 
            name="Level"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="experience" 
            stroke="#48bb78" 
            strokeWidth={2} 
            name="Experience"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

