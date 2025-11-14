import { useState } from "react";
import { useUserStats } from "../../core/contexts/UserStatsContext";
import { Navigation } from "../../components/Navigation";
import { useNavigate } from "react-router-dom";
import { SKILL_LIBRARY } from "../../core/constants";
import { SkillCategory } from "../../core/types";
import type { Skill } from "../../core/types";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../core/firebase";
import { useAuth } from "../../core/contexts/AuthContext";
import "./SkillsView.css";

export const SkillsView = () => {
  const { currentUser } = useAuth();
  const { majorSkillGroups, refreshUserData } = useUserStats();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);

  const handleAddSkill = async (skillTemplate: { id: string; name: string; baseRating: number }, category: SkillCategory) => {
    if (!currentUser) return;

    const newSkill: Skill = {
      id: `${category}-${skillTemplate.id}-${Date.now()}`,
      name: skillTemplate.name,
      category,
      rating: skillTemplate.baseRating,
      experience: 0,
      level: 1
    };

    await setDoc(doc(db, "skills", newSkill.id), {
      ...newSkill,
      userId: currentUser.uid
    });

    await refreshUserData();
  };

  const userSkillIds = new Set(
    majorSkillGroups.flatMap(group => group.skills.map(s => `${group.category}-${s.name.toLowerCase()}`))
  );

  return (
    <div className="page">
      <Navigation />
      <div className="pageHeader">
        <h1 className="pageTitle">Skills Library</h1>
      </div>

      <div className="section">
        <h2>Select a Category</h2>
        <div className="categoryButtons">
          {Object.values(SkillCategory).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className={selectedCategory === category ? "active" : ""}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div className="section">
          <h2>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Skills</h2>
          <div className="skillsList">
            {SKILL_LIBRARY[selectedCategory].map((skillTemplate) => {
              const skillKey = `${selectedCategory}-${skillTemplate.name.toLowerCase()}`;
              const isAdded = userSkillIds.has(skillKey);
              return (
                <div key={skillTemplate.id} className="skillItem">
                  <div>
                    <strong>{skillTemplate.name}</strong> - Starting Rating: {skillTemplate.baseRating}/100
                  </div>
                  {!isAdded ? (
                    <button onClick={() => handleAddSkill(skillTemplate, selectedCategory)}>
                      Add Skill
                    </button>
                  ) : (
                    <span>✓ Added</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
