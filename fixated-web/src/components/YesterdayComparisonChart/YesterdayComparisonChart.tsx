import { useUserStats } from "../../core/contexts/UserStatsContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./YesterdayComparisonChart.css";

export const YesterdayComparisonChart = () => {
  const { progressHistory, user } = useUserStats();

  if (!progressHistory || progressHistory.length < 2 || !user) {
    return (
      <div className="chartContainer">
        <h3 className="chartTitle">Today vs Yesterday</h3>
        <div className="noDataMessage">Need at least 2 days of data to compare!</div>
      </div>
    );
  }

  // Get today and yesterday data
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayData = progressHistory.find(data => {
    const dataDate = data.date instanceof Date 
      ? data.date 
      : typeof data.date === 'string' 
        ? new Date(data.date) 
        : (data.date as any)?.toDate?.() || new Date();
    const d = new Date(dataDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  const yesterdayData = progressHistory.find(data => {
    const dataDate = data.date instanceof Date 
      ? data.date 
      : typeof data.date === 'string' 
        ? new Date(data.date) 
        : (data.date as any)?.toDate?.() || new Date();
    const d = new Date(dataDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === yesterday.getTime();
  });

  // Use current user stats if today's data not found
  const todayStats = todayData || {
    overallRating: user.overallRating,
    level: user.level,
    experience: user.experience
  };

  // Use yesterday's data or default values
  const yesterdayStats = yesterdayData || {
    overallRating: user.overallRating,
    level: user.level,
    experience: user.experience
  };

  const comparisonData = [
    {
      metric: "Rating",
      yesterday: yesterdayStats.overallRating,
      today: todayStats.overallRating,
      change: todayStats.overallRating - yesterdayStats.overallRating
    },
    {
      metric: "Level",
      yesterday: yesterdayStats.level,
      today: todayStats.level,
      change: todayStats.level - yesterdayStats.level
    },
    {
      metric: "Experience",
      yesterday: yesterdayStats.experience,
      today: todayStats.experience,
      change: todayStats.experience - yesterdayStats.experience
    }
  ];

  return (
    <div className="chartContainer">
      <h3 className="chartTitle">Today vs Yesterday Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="yesterday" fill="#9ca3af" name="Yesterday" />
          <Bar dataKey="today" fill="#667eea" name="Today" />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="comparisonDetails">
        {comparisonData.map((item, index) => (
          <div key={index} className="comparisonItem">
            <div className="comparisonMetric">{item.metric}</div>
            <div className="comparisonValues">
              <span className="yesterdayValue">{item.yesterday}</span>
              <span className="arrow">→</span>
              <span className={`todayValue ${item.change > 0 ? 'positive' : item.change < 0 ? 'negative' : ''}`}>
                {item.today}
              </span>
              {item.change !== 0 && (
                <span className={`change ${item.change > 0 ? 'positive' : 'negative'}`}>
                  {item.change > 0 ? '+' : ''}{item.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

