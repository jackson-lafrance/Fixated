import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../core/firebase";
import { User } from "../../core/types";
import { useAuth } from "../../core/contexts/AuthContext";
import "./Leaderboard.css";

interface LeaderboardProps {
  topCount?: number;
}

export const Leaderboard = ({ topCount = 100 }: LeaderboardProps) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      const usersQuery = query(
        collection(db, "users"),
        orderBy("overallRating", "desc"),
        limit(topCount)
      );
      
      const snapshot = await getDocs(usersQuery);
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      } as User));
      
      setUsers(usersData);
    } catch (error) {
      setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [topCount]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboard();
  };

  const formatExperience = (exp: number) => {
    if (exp >= 1000000) return `${(exp / 1000000).toFixed(1)}M`;
    if (exp >= 1000) return `${(exp / 1000).toFixed(1)}K`;
    return exp.toString();
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#FFD700";
    if (rank === 2) return "#C0C0C0";
    if (rank === 3) return "#CD7F32";
    return "#ffffff";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <div className="header-content">
          <div>
            <h1>Global Leaderboard</h1>
            <p>Top {topCount} Players</p>
          </div>
          <button 
            className="refresh-button" 
            onClick={handleRefresh}
            disabled={refreshing || loading}
          >
            {refreshing ? "⟳" : "↻"}
          </button>
        </div>
      </div>
      <div className="leaderboard-list">
        {users.length === 0 ? (
          <div className="leaderboard-empty">
            <div className="empty-icon">🏆</div>
            <h3>No players yet</h3>
            <p>Be the first to join the leaderboard!</p>
          </div>
        ) : (
          users.map((user, index) => {
            const rank = index + 1;
            const rankColor = getRankColor(rank);
            const rankIcon = getRankIcon(rank);

            const isCurrentUser = currentUser && user.id === currentUser.uid;

            return (
              <div 
                key={user.id} 
                className={`leaderboard-item ${isCurrentUser ? "current-user" : ""}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="leaderboard-rank" style={{ color: rankColor }}>
                  {rankIcon || `#${rank}`}
                </div>
                <div className="leaderboard-user-info">
                  <div className="leaderboard-username">{user.displayName || user.email}</div>
                  <div className="leaderboard-meta">
                    <span className="leaderboard-level">Level {user.level}</span>
                    <span className="leaderboard-exp">{formatExperience(user.experience)} XP</span>
                  </div>
                </div>
                <div className="leaderboard-rating">
                  <div className="rating-value">{user.overallRating}</div>
                  <div className="rating-label">OVR</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

