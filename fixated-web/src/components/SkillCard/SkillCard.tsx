import { Skill } from "../../core/types";
import "./SkillCard.css";

interface SkillCardProps {
  skill: Skill;
  onClick?: () => void;
}

export const SkillCard = ({ skill, onClick }: SkillCardProps) => {
  return (
    <div className="skillCard" onClick={onClick}>
      <div className="skillHeader">
        <h3 className="skillName">{skill.name}</h3>
        <div className="skillRating">{skill.rating}/100</div>
      </div>
      <div className="skillLevel">Level {skill.level}</div>
      <div className="skillProgress">
        <div className="skillProgressBar">
          <div 
            className="skillProgressFill"
            style={{ width: `${skill.rating}%` }}
          />
        </div>
      </div>
    </div>
  );
};

