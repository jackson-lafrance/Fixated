import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { User, Skill, MajorSkillGroup, ProgressData } from "../types";
import { SkillCategory, SKILL_LIBRARY } from "../constants";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface UserStatsContextType {
  user: User | null;
  majorSkillGroups: MajorSkillGroup[];
  progressHistory: ProgressData[];
  updateSkillRating: (skillId: string, newRating: number) => Promise<void>;
  addExperience: (amount: number) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const UserStatsContext = createContext<UserStatsContextType | undefined>(undefined);

export const useUserStats = () => {
  const context = useContext(UserStatsContext);
  if (!context) {
    throw new Error("useUserStats must be used within UserStatsProvider");
  }
  return context;
};

export const UserStatsProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [majorSkillGroups, setMajorSkillGroups] = useState<MajorSkillGroup[]>([]);
  const [progressHistory, setProgressHistory] = useState<ProgressData[]>([]);

  const loadUserData = async () => {
    if (!currentUser) return;

    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
    if (userDoc.exists()) {
      const userData = { id: userDoc.id, ...userDoc.data() } as User;
      setUser(userData);
    }

    const skillsQuery = query(collection(db, "skills"), where("userId", "==", currentUser.uid));
    const skillsSnapshot = await getDocs(skillsQuery);
    const skills = skillsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Skill));

    const groups: MajorSkillGroup[] = Object.values(SkillCategory).map(category => {
      const categorySkills = skills.filter(s => s.category === category);
      const overallRating = categorySkills.length > 0
        ? Math.round(categorySkills.reduce((sum, s) => sum + s.rating, 0) / categorySkills.length)
        : 50;

      return {
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        category,
        overallRating,
        skills: categorySkills
      };
    });

    setMajorSkillGroups(groups);

    const progressQuery = query(collection(db, "progress"), where("userId", "==", currentUser.uid));
    const progressSnapshot = await getDocs(progressQuery);
    const progress = progressSnapshot.docs.map(doc => ({
      ...doc.data(),
      date: doc.data().date.toDate()
    } as ProgressData));
    setProgressHistory(progress.sort((a, b) => a.date.getTime() - b.date.getTime()));
  };

  useEffect(() => {
    loadUserData();
  }, [currentUser]);

  const updateSkillRating = async (skillId: string, newRating: number) => {
    if (!currentUser || !user) return;

    const skillDoc = doc(db, "skills", skillId);
    await setDoc(skillDoc, { rating: newRating }, { merge: true });
    await loadUserData();
  };

  const addExperience = async (amount: number) => {
    if (!currentUser || !user) return;

    const newExperience = user.experience + amount;
    const newLevel = Math.floor(newExperience / 1000) + 1;
    
    const userDoc = doc(db, "users", currentUser.uid);
    await setDoc(userDoc, {
      experience: newExperience,
      level: newLevel
    }, { merge: true });
    
    await loadUserData();
  };

  const refreshUserData = async () => {
    await loadUserData();
  };

  return (
    <UserStatsContext.Provider value={{
      user,
      majorSkillGroups,
      progressHistory,
      updateSkillRating,
      addExperience,
      refreshUserData
    }}>
      {children}
    </UserStatsContext.Provider>
  );
};

