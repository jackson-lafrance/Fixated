import { useHabits } from "../../core/contexts/HabitsContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import "./HabitCompletionChart.css";

export const HabitCompletionChart = () => {
  const { habits } = useHabits();

  if (!habits || habits.length === 0) {
    return (
      <div className="chartContainer">
        <h3 className="chartTitle">Habit Completion Rate</h3>
        <div className="noDataMessage">No habits yet. Add habits to see completion rates!</div>
      </div>
    );
  }

  // Calculate completion data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const completionData = last7Days.map(date => {
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    let completed = 0;
    let total = 0;

    habits.forEach(habit => {
      total++;
      const isCompleted = habit.completedDates.some(completedDate => {
        const d = new Date(completedDate);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === date.getTime();
      });
      if (isCompleted) completed++;
    });

    return {
      date: dateStr,
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  });

  const COLORS = ['#667eea', '#764ba2', '#48bb78', '#f59e0b', '#ef4444'];

  return (
    <div className="chartContainer">
      <h3 className="chartTitle">Habit Completion Rate (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={completionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            formatter={(value: number, name: string) => {
              if (name === "completed") return [`${value} habits`, "Completed"];
              if (name === "total") return [`${value} habits`, "Total"];
              return value;
            }}
          />
          <Legend />
          <Bar dataKey="completed" fill="#4caf50" name="Completed Habits" />
          <Bar dataKey="total" fill="#e0e0e0" name="Total Habits" />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="completionSummary">
        <h4>Completion Summary</h4>
        <div className="summaryGrid">
          {completionData.map((day, index) => (
            <div key={index} className="summaryItem">
              <div className="summaryDate">{day.date}</div>
              <div className="summaryBar">
                <div 
                  className="summaryBarFill" 
                  style={{ width: `${day.percentage}%`, background: day.percentage === 100 ? '#4caf50' : day.percentage >= 50 ? '#48bb78' : '#f59e0b' }}
                />
              </div>
              <div className="summaryText">{day.completed}/{day.total} ({day.percentage}%)</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

