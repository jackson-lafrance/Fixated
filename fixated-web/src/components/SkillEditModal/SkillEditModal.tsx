import { useState, useEffect } from "react";
import { Skill, SkillCategory } from "../../core/types";
import "./SkillEditModal.css";

interface SkillEditModalProps {
  skill: Skill;
  onSave: (updates: Partial<Skill>) => Promise<void>;
  onClose: () => void;
}

export const SkillEditModal = ({ skill, onSave, onClose }: SkillEditModalProps) => {
  const [name, setName] = useState(skill.name);
  const [category, setCategory] = useState<SkillCategory>(skill.category);
  const [rating, setRating] = useState(skill.rating);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(skill.name);
    setCategory(skill.category);
    setRating(skill.rating);
  }, [skill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Skill name is required");
      return;
    }

    if (rating < 0 || rating > 100) {
      setError("Rating must be between 0 and 100");
      return;
    }

    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        category,
        rating
      });
    } catch (err: any) {
      setError(err.message || "Failed to update skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h2>Edit Skill</h2>
          <button className="closeButton" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modalForm">
          {error && <div className="errorMessage">{error}</div>}

          <div className="formGroup">
            <label htmlFor="skillName">Skill Name</label>
            <input
              id="skillName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter skill name"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="skillCategory">Category</label>
            <select
              id="skillCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value as SkillCategory)}
              required
            >
              {Object.values(SkillCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="formGroup">
            <label htmlFor="skillRating">Rating (0-100)</label>
            <input
              id="skillRating"
              type="number"
              min="0"
              max="100"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="modalActions">
            <button type="button" className="cancelButton" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="saveButton" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

