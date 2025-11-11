import { Leaderboard } from "../../components/Leaderboard";
import "./LeaderboardView.css";

export const LeaderboardView = () => {
  return (
    <div className="leaderboard-view">
      <Leaderboard topCount={100} />
    </div>
  );
};

