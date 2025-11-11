import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserStats } from "../../core/contexts/UserStatsContext";
import { SKILL_LIBRARY, SkillCategory } from "../../core/constants";
import { SkillCard } from "../../components/SkillCard";
import { Skill } from "../../core/types";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../core/firebase";
import { useAuth } from "../../core/contexts/AuthContext";
import { Loading } from "../../components/Loading";
import "./SkillsView.css";

export const SkillsView = () => {
  const { currentUser } = useAuth();
  const { majorSkillGroups, refreshUserData, loading } = useUserStats();
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
  const [addingSkillId, setAddingSkillId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleAddSkill = async (skillTemplate: { id: string; name: string; baseRating: number }, category: SkillCategory) => {
    if (!currentUser) return;

    const skillKey = `${category}-${skillTemplate.id}`;
    setAddingSkillId(skillKey);
    setError("");
    setSuccessMessage("");

    try {
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
      setSuccessMessage(`${skillTemplate.name} added successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to add skill. Please try again.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setAddingSkillId(null);
    }
  };

  const userSkillIds = new Set(
    majorSkillGroups.flatMap(group => group.skills.map(s => `${group.category}-${s.name.toLowerCase()}`))
  );

  if (loading) {
    return (
      <div className="skillsViewContainer">
        <nav className="skillsNav">
          <Link to="/dashboard" className="backLink">← Back to Dashboard</Link>
        </nav>
        <Loading message="Loading skills library..." />
      </div>
    );
  }

  return (
    <div className="skillsViewContainer">
      <nav className="skillsNav">
        <Link to="/dashboard" className="backLink">← Back to Dashboard</Link>
      </nav>
      <h1 className="skillsViewTitle">Skills Library</h1>
      
      {error && <div className="errorMessage">{error}</div>}
      {successMessage && <div className="successMessage">{successMessage}</div>}
      
      <div className="categoryTabs">
        {Object.values(SkillCategory).map((category) => (
          <button
            key={category}
            className={`categoryTab ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      {selectedCategory && (
        <div className="skillsLibrary">
          <h2 className="categoryTitle">{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Skills</h2>
          <div className="skillsGrid">
            {SKILL_LIBRARY[selectedCategory].map((skillTemplate) => {
              const skillKey = `${selectedCategory}-${skillTemplate.name.toLowerCase()}`;
              const isAdded = userSkillIds.has(skillKey);
              return (
                <div key={skillTemplate.id} className="skillTemplateCard">
                  <h3 className="skillTemplateName">{skillTemplate.name}</h3>
                  <p className="skillTemplateRating">Starting Rating: {skillTemplate.baseRating}/100</p>
                  {!isAdded ? (
                    <button
                      className="addSkillButton"
                      onClick={() => handleAddSkill(skillTemplate, selectedCategory)}
                      disabled={addingSkillId === `${selectedCategory}-${skillTemplate.id}`}
                    >
                      {addingSkillId === `${selectedCategory}-${skillTemplate.id}` ? "Adding..." : "Add Skill"}
                    </button>
                  ) : (
                    <div className="skillAdded">✓ Added</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {!selectedCategory && (
        <div className="selectCategoryMessage">Select a category to view available skills</div>
      )}
    </div>
  );
};

