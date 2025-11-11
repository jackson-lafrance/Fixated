import { useHabits } from "../../core/contexts/HabitsContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import "./StreakChart.css";

export const StreakChart = () => {
  const { habits } = useHabits();

  if (!habits || habits.length === 0) {
    return (
      <div className="chartContainer">
        <h3 className="chartTitle">Habit Streaks</h3>
        <div className="noDataMessage">No habits yet. Add habits to see streak data!</div>
      </div>
    );
  }

  const streakData = habits
    .map(habit => ({
      name: habit.name.length > 20 ? habit.name.substring(0, 20) + "..." : habit.name,
      fullName: habit.name,
      streak: habit.streak,
      frequency: habit.frequency
    }))
    .sort((a, b) => b.streak - a.streak);

  const getColor = (streak: number) => {
    if (streak >= 30) return '#4caf50'; // Green for 30+ days
    if (streak >= 14) return '#48bb78'; // Light green for 14+ days
    if (streak >= 7) return '#f59e0b'; // Orange for 7+ days
    if (streak >= 3) return '#ff9800'; // Dark orange for 3+ days
    return '#ef4444'; // Red for less than 3 days
  };

  return (
    <div className="chartContainer">
      <h3 className="chartTitle">Current Habit Streaks</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={streakData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={90} />
          <Tooltip 
            formatter={(value: number, name: string, props: any) => [
              `${value} days 🔥`,
              props.payload.fullName
            ]}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Bar dataKey="streak" radius={[0, 8, 8, 0]}>
            {streakData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.streak)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="streakStats">
        <div className="statItem">
          <span className="statLabel">Longest Streak:</span>
          <span className="statValue">{Math.max(...streakData.map(h => h.streak))} days</span>
        </div>
        <div className="statItem">
          <span className="statLabel">Average Streak:</span>
          <span className="statValue">
            {Math.round(streakData.reduce((sum, h) => sum + h.streak, 0) / streakData.length)} days
          </span>
        </div>
        <div className="statItem">
          <span className="statLabel">Active Habits:</span>
          <span className="statValue">{habits.length}</span>
        </div>
      </div>
    </div>
  );
};

