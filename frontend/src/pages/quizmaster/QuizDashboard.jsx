import React, { useEffect, useState } from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import StatCard from "../../components/dashboard/StatCard";
import ActionButton from "../../components/dashboard/ActionButton";
import { 
  FaUser, 
  FaBook, 
  FaTrophy, 
  FaChartLine, 
  FaPlay, 
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaUsers,
  FaGraduationCap
} from "react-icons/fa";

const QuizDashboard = () => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState("student"); // "student" or "admin"
  const [stats, setStats] = useState({
    quizzesCompleted: 0,
    averageScore: 0,
    totalQuizzes: 0,
    rank: null,
  });

  useEffect(() => {
    // Get user from localStorage
    const student = localStorage.getItem("student");
    const admin = localStorage.getItem("admin");
    
    if (admin) {
      setUser(admin);
      setUserType("admin");
      // Admin stats
      setStats({
        quizzesCompleted: 0,
        averageScore: 0,
        totalQuizzes: 12,
        rank: null,
      });
    } else if (student) {
      setUser(student);
      setUserType("student");
      // Student stats
      setStats({
        quizzesCompleted: 5,
        averageScore: 85,
        totalQuizzes: 10,
        rank: 3,
      });
    }
  }, []);

  const handleStartQuiz = () => {
    // Navigate to quiz or show quiz selection
    console.log("Start Quiz clicked");
  };

  const handleViewHistory = () => {
    console.log("View History clicked");
  };

  const handleManageQuizzes = () => {
    console.log("Manage Quizzes clicked");
  };

  const handleSettings = () => {
    console.log("Settings clicked");
  };

  const handleLogout = () => {
    localStorage.removeItem("student");
    localStorage.removeItem("admin");
    window.location.href = "/";
  };

  // Admin-specific actions
  const adminActions = [
    {
      icon: <FaBook />,
      title: "Create Quiz",
      description: "Create a new quiz for students",
      onClick: () => console.log("Create Quiz"),
    },
    {
      icon: <FaUsers />,
      title: "Manage Students",
      description: "View and manage student accounts",
      onClick: () => console.log("Manage Students"),
    },
    {
      icon: <FaChartLine />,
      title: "Analytics",
      description: "View detailed analytics and reports",
      onClick: () => console.log("Analytics"),
    },
  ];

  // Student-specific actions
  const studentActions = [
    {
      icon: <FaPlay />,
      title: "Start Quiz",
      description: "Begin a new quiz session",
      onClick: handleStartQuiz,
    },
    {
      icon: <FaHistory />,
      title: "Quiz History",
      description: "View your past quiz results",
      onClick: handleViewHistory,
    },
    {
      icon: <FaTrophy />,
      title: "Leaderboard",
      description: "See how you rank among others",
      onClick: () => console.log("Leaderboard"),
    },
  ];

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center transition-all duration-700 ease-in-out px-4"
        style={{
          background: `linear-gradient(135deg,
            var(--bg-gradient-start),
            var(--bg-gradient-mid),
            var(--bg-gradient-end)
          )`,
        }}
      >
        <DashboardCard>
          <p style={{ color: "var(--text-color)" }}>Please log in to access the dashboard.</p>
        </DashboardCard>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen transition-all duration-700 ease-in-out px-4 py-24"
      style={{
        background: `linear-gradient(135deg,
          var(--bg-gradient-start),
          var(--bg-gradient-mid),
          var(--bg-gradient-end)
        )`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 
                className="text-4xl md:text-5xl font-extrabold mb-2
                           bg-clip-text text-transparent
                           bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              >
                Welcome back, {user}!
              </h1>
              <p 
                className="text-lg opacity-80"
                style={{ color: "var(--text-color)" }}
              >
                {userType === "admin" ? "Manage your quiz platform" : "Ready to test your knowledge?"}
              </p>
            </div>
            <div className="flex gap-3">
              <ActionButton
                variant="secondary"
                onClick={handleSettings}
                className="w-auto px-4"
              >
                <FaCog className="inline mr-2" />
                Settings
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={handleLogout}
                className="w-auto px-4"
              >
                <FaSignOutAlt className="inline mr-2" />
                Logout
              </ActionButton>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {userType === "student" ? (
            <>
              <div className="animate-slideInUp" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
                <StatCard
                  icon={<FaBook />}
                  title="Quizzes Completed"
                  value={stats.quizzesCompleted}
                  subtitle={`of ${stats.totalQuizzes} available`}
                />
              </div>
              <div className="animate-slideInUp" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
                <StatCard
                  icon={<FaChartLine />}
                  title="Average Score"
                  value={`${stats.averageScore}%`}
                  subtitle="Keep it up!"
                />
              </div>
              <div className="animate-slideInUp" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
                <StatCard
                  icon={<FaTrophy />}
                  title="Your Rank"
                  value={stats.rank ? `#${stats.rank}` : "N/A"}
                  subtitle="Top performer"
                />
              </div>
              <div className="animate-slideInUp" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
                <StatCard
                  icon={<FaGraduationCap />}
                  title="Total Quizzes"
                  value={stats.totalQuizzes}
                  subtitle="Available to take"
                />
              </div>
            </>
          ) : (
            <>
              <div className="animate-slideInUp" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
                <StatCard
                  icon={<FaBook />}
                  title="Total Quizzes"
                  value={stats.totalQuizzes}
                  subtitle="Created quizzes"
                />
              </div>
              <div className="animate-slideInUp" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
                <StatCard
                  icon={<FaUsers />}
                  title="Active Students"
                  value="24"
                  subtitle="Registered users"
                />
              </div>
              <div className="animate-slideInUp" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
                <StatCard
                  icon={<FaChartLine />}
                  title="Avg. Score"
                  value="78%"
                  subtitle="Platform average"
                />
              </div>
              <div className="animate-slideInUp" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
                <StatCard
                  icon={<FaTrophy />}
                  title="Completions"
                  value="156"
                  subtitle="Total attempts"
                />
              </div>
            </>
          )}
        </div>

        {/* Actions Section */}
        <div className="mb-8">
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: "var(--text-color)" }}
          >
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {(userType === "admin" ? adminActions : studentActions).map((action, index) => (
              <div
                key={index}
                className="animate-slideInUp"
                style={{ 
                  animationDelay: `${0.5 + index * 0.1}s`, 
                  animationFillMode: "both" 
                }}
              >
                <DashboardCard onClick={action.onClick}>
                  <div className="flex items-start gap-4">
                    <div 
                      className="text-3xl opacity-80 flex-shrink-0" 
                      style={{ color: "var(--text-color)" }}
                    >
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <h3 
                        className="text-xl font-semibold mb-2"
                        style={{ color: "var(--text-color)" }}
                      >
                        {action.title}
                      </h3>
                      <p 
                        className="text-sm opacity-70"
                        style={{ color: "var(--text-color)" }}
                      >
                        {action.description}
                      </p>
                    </div>
                  </div>
                </DashboardCard>
              </div>
            ))}
          </div>
        </div>

        {/* Main Action Card */}
        <div className="animate-slideInUp" style={{ animationDelay: "0.8s", animationFillMode: "both" }}>
          <DashboardCard className="text-center">
            <div className="mb-6">
              <h2 
                className="text-3xl font-bold mb-3"
                style={{ color: "var(--text-color)" }}
              >
                {userType === "admin" ? "Manage Your Platform" : "Ready to Start?"}
              </h2>
              <p 
                className="text-lg opacity-80 mb-6"
                style={{ color: "var(--text-color)" }}
              >
                {userType === "admin" 
                  ? "Create and manage quizzes for your students" 
                  : "Take a quiz and test your knowledge 🎯"}
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <ActionButton onClick={userType === "admin" ? handleManageQuizzes : handleStartQuiz}>
                {userType === "admin" ? "Manage Quizzes" : "Start Quiz"}
              </ActionButton>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default QuizDashboard;
