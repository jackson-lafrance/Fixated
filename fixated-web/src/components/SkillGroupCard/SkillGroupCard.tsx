import { MajorSkillGroup } from "../../core/types";
import "./SkillGroupCard.css";

interface SkillGroupCardProps {
  group: MajorSkillGroup;
}

const SkillGroupCard = ({ group }: SkillGroupCardProps) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 90) return "#00ff00";
    if (rating >= 80) return "#90ee90";
    if (rating >= 70) return "#ffd700";
    if (rating >= 60) return "#ffa500";
    return "#ff6b6b";
  };

  return (
    <div className="skillGroupCard">
      <div className="skillGroupHeader">
        <h3 className="skillGroupName">{group.name}</h3>
        <div 
          className="skillGroupRating" 
          style={{ color: getRatingColor(group.overallRating) }}
        >
          {group.overallRating}
        </div>
      </div>
      <div className="skillGroupSkills">
        {group.skills.length > 0 ? (
          group.skills.map((skill) => (
            <div key={skill.id} className="skillItem">
              <span className="skillName">{skill.name}</span>
              <div className="skillRatingBar">
                <div 
                  className="skillRatingFill" 
                  style={{ 
                    width: `${skill.rating}%`,
                    backgroundColor: getRatingColor(skill.rating)
                  }}
                />
                <span className="skillRatingValue">{skill.rating}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="noSkills">No skills tracked yet</div>
        )}
      </div>
    </div>
  );
};

export default SkillGroupCard;

