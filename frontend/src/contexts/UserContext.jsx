// context/UserContext.js
import React, { createContext, useState, useContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userAchievements, setUserAchievements] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userStats, setUserStats] = useState({
    quiz_streak: 0,
    perfect_quiz_streak: 0,
    total_quiz_score: 0,
    quiz_attempts: 0,
    quick_answers: 0,
    perfect_quizzes: 0,
    last_quiz_date: null
  });

  const allAchievementsData = [
    {
      id: 'quiz_starter',
      title: 'Quiz Starter',
      description: 'Complete your first quiz',
      points: 50,
      requirement: { type: 'quiz_completed', target: 1 }
    },
    {
      id: 'quiz_master',
      title: 'Quiz Master',
      description: 'Answer quizzes correctly 10 days in a row',
      points: 350,
      requirement: { type: 'quiz_streak', target: 10 }
    },
    {
      id: 'quiz_expert',
      title: 'Quiz Expert',
      description: 'Get perfect score in quiz 7 days streak',
      points: 400,
      requirement: { type: 'perfect_quiz_streak', target: 7 }
    },
    {
      id: 'quick_thinker',
      title: 'Quick Thinker',
      description: 'Answer 20 quiz questions in under 10 seconds each',
      points: 200,
      requirement: { type: 'quick_answers', target: 20 }
    },
    {
      id: 'perfect_score',
      title: 'Perfect Score',
      description: 'Get 100% on a quiz 5 times',
      points: 300,
      requirement: { type: 'perfect_quizzes', target: 5 }
    },
    {
      id: 'nature_expert',
      title: 'Nature Expert',
      description: 'Score 100 points in total from quizzes',
      points: 500,
      requirement: { type: 'total_quiz_score', target: 100 }
    }
  ];

  const updateQuizAchievements = (quizData) => {
    const today = new Date().toDateString();
    const lastDate = userStats.last_quiz_date ? new Date(userStats.last_quiz_date).toDateString() : null;
    
    let newStats = { ...userStats };
    let newAchievements = [...userAchievements];
    const unlockedAchievements = [];

    // Update basic stats
    newStats.quiz_attempts += 1;
    newStats.total_quiz_score += quizData.score;
    newStats.quick_answers += quizData.quickAnswers || 0;
    
    if (quizData.perfectScore) {
      newStats.perfect_quizzes += 1;
    }

    // Check streak continuation
    const isYesterday = (dateStr) => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toDateString() === dateStr;
    };

    if (lastDate === today) {
      // Already played today, don't update streak
    } else if (lastDate && isYesterday(lastDate)) {
      // Continued streak
      newStats.quiz_streak += 1;
      if (quizData.perfectScore) {
        newStats.perfect_quiz_streak += 1;
      } else {
        newStats.perfect_quiz_streak = 0;
      }
    } else {
      // New streak or broken streak
      newStats.quiz_streak = 1;
      newStats.perfect_quiz_streak = quizData.perfectScore ? 1 : 0;
    }

    newStats.last_quiz_date = new Date().toISOString();

    // Check for unlocked achievements
    const achievementChecks = [
      {
        id: 'quiz_starter',
        condition: newStats.quiz_attempts >= 1 && !userAchievements.includes('quiz_starter'),
        points: 50
      },
      {
        id: 'quiz_master',
        condition: newStats.quiz_streak >= 10 && !userAchievements.includes('quiz_master'),
        points: 350
      },
      {
        id: 'quiz_expert',
        condition: newStats.perfect_quiz_streak >= 7 && !userAchievements.includes('quiz_expert'),
        points: 400
      },
      {
        id: 'quick_thinker',
        condition: newStats.quick_answers >= 20 && !userAchievements.includes('quick_thinker'),
        points: 200
      },
      {
        id: 'perfect_score',
        condition: newStats.perfect_quizzes >= 5 && !userAchievements.includes('perfect_score'),
        points: 300
      },
      {
        id: 'nature_expert',
        condition: newStats.total_quiz_score >= 100 && !userAchievements.includes('nature_expert'),
        points: 500
      }
    ];

    achievementChecks.forEach(check => {
      if (check.condition) {
        newAchievements.push(check.id);
        unlockedAchievements.push({
          id: check.id,
          title: allAchievementsData.find(a => a.id === check.id)?.title || '',
          description: allAchievementsData.find(a => a.id === check.id)?.description || '',
          points: check.points
        });
        setUserPoints(prev => prev + check.points);
      }
    });

    // Update state
    setUserStats(newStats);
    setUserAchievements(newAchievements);

    return {
      newStats,
      newAchievements: unlockedAchievements
    };
  };

  const addPoints = (points) => {
    setUserPoints(prev => prev + points);
  };

  const claimAchievement = (achievementId, points) => {
    if (!userAchievements.includes(achievementId)) {
      setUserAchievements(prev => [...prev, achievementId]);
      setUserPoints(prev => prev + points);
    }
  };

  return (
    <UserContext.Provider value={{
      userAchievements,
      userPoints,
      userStats,
      updateQuizAchievements,
      claimAchievement,
      addPoints,
      setUserAchievements,
      setUserPoints,
      allAchievementsData
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);