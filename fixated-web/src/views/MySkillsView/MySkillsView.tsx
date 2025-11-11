import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserStats } from "../../core/contexts/UserStatsContext";
import { Skill, SkillCategory } from "../../core/types";
import { SkillCard } from "../../components/SkillCard";
import { Loading } from "../../components/Loading";
import { SkillEditModal } from "../../components/SkillEditModal";
import "./MySkillsView.css";

export const MySkillsView = () => {
  const { majorSkillGroups, loading, updateSkillRating, updateSkill, deleteSkill } = useUserStats();
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [updatingRatingId, setUpdatingRatingId] = useState<string | null>(null);
  const [deletingSkillId, setDeletingSkillId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const allSkills = majorSkillGroups.flatMap(group => group.skills);

  const handleUpdateRating = async (skillId: string, newRating: number) => {
    if (newRating < 0 || newRating > 100) {
      setError("Rating must be between 0 and 100");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setUpdatingRatingId(skillId);
    setError("");
    setSuccessMessage("");

    try {
      await updateSkillRating(skillId, newRating);
      setSuccessMessage("Rating updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update rating");
      setTimeout(() => setError(""), 5000);
    } finally {
      setUpdatingRatingId(null);
    }
  };

  const handleDeleteSkill = async (skillId: string, skillName: string) => {
    if (!confirm(`Are you sure you want to delete "${skillName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingSkillId(skillId);
    setError("");
    setSuccessMessage("");

    try {
      await deleteSkill(skillId);
      setSuccessMessage(`${skillName} deleted successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete skill");
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeletingSkillId(null);
    }
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
  };

  const handleSaveEdit = async (updates: Partial<Skill>) => {
    if (!editingSkill) return;

    setError("");
    setSuccessMessage("");

    try {
      await updateSkill(editingSkill.id, updates);
      setSuccessMessage("Skill updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setEditingSkill(null);
    } catch (err: any) {
      setError(err.message || "Failed to update skill");
      setTimeout(() => setError(""), 5000);
    }
  };

  if (loading) {
    return (
      <div className="mySkillsContainer">
        <nav className="mySkillsNav">
          <Link to="/dashboard" className="backLink">← Back to Dashboard</Link>
        </nav>
        <Loading message="Loading your skills..." />
      </div>
    );
  }

  return (
    <div className="mySkillsContainer">
      <nav className="mySkillsNav">
        <Link to="/dashboard" className="backLink">← Back to Dashboard</Link>
      </nav>

      <h1 className="mySkillsTitle">My Skills</h1>

      {error && <div className="errorMessage">{error}</div>}
      {successMessage && <div className="successMessage">{successMessage}</div>}

      {allSkills.length === 0 ? (
        <div className="emptyState">
          <p>You haven't added any skills yet.</p>
          <Link to="/skills" className="ctaButton">Browse Skills Library</Link>
        </div>
      ) : (
        <>
          <div className="skillsSummary">
            <p>Total Skills: <strong>{allSkills.length}</strong></p>
            <Link to="/skills" className="addMoreLink">+ Add More Skills</Link>
          </div>

          {majorSkillGroups
            .filter(group => group.skills.length > 0)
            .map((group) => (
              <div key={group.id} className="skillCategorySection">
                <div className="categoryHeader">
                  <h2 className="categoryName">{group.name}</h2>
                  <span className="categoryStats">
                    {group.skills.length} skill{group.skills.length !== 1 ? "s" : ""} • 
                    Avg Rating: {group.overallRating}/100
                  </span>
                </div>

                <div className="skillsList">
                  {group.skills.map((skill) => (
                    <div key={skill.id} className="skillManagementCard">
                      <div className="skillCardWrapper">
                        <SkillCard skill={skill} />
                      </div>
                      
                      <div className="skillActions">
                        <div className="ratingControl">
                          <label htmlFor={`rating-${skill.id}`}>Rating:</label>
                          <input
                            id={`rating-${skill.id}`}
                            type="number"
                            min="0"
                            max="100"
                            value={skill.rating}
                            onChange={(e) => {
                              const newRating = parseInt(e.target.value) || 0;
                              handleUpdateRating(skill.id, newRating);
                            }}
                            disabled={updatingRatingId === skill.id}
                            className="ratingInput"
                          />
                          {updatingRatingId === skill.id && <span className="updatingIndicator">Updating...</span>}
                        </div>

                        <div className="actionButtons">
                          <button
                            className="editButton"
                            onClick={() => handleEditSkill(skill)}
                          >
                            Edit
                          </button>
                          <button
                            className="deleteButton"
                            onClick={() => handleDeleteSkill(skill.id, skill.name)}
                            disabled={deletingSkillId === skill.id}
                          >
                            {deletingSkillId === skill.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </>
      )}

      {editingSkill && (
        <SkillEditModal
          skill={editingSkill}
          onSave={handleSaveEdit}
          onClose={() => setEditingSkill(null)}
        />
      )}
    </div>
  );
};

