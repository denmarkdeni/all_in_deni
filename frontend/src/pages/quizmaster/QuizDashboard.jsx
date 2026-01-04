import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FaGraduationCap,
  FaLayerGroup
} from "react-icons/fa";

const QuizDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState("student");
  const [stats, setStats] = useState({
    quizzesCompleted: 0,
    averageScore: 0,
    totalQuizzes: 0,
    rank: null,
  });

  useEffect(() => {
    // Get user from localStorage
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    
    if (username) {
      setUser(username);
      // Set userType based on role from backend
      if (role.toLowerCase() === "admin") {
        setUserType("admin");
        // Admin stats
        setStats({
          quizzesCompleted: 0,
          averageScore: 0,
          totalQuizzes: 12,
          rank: null,
        });
      } else {
        setUserType("student");
        // Student stats
        setStats({
          quizzesCompleted: 5,
          averageScore: 85,
          totalQuizzes: 10,
          rank: 3,
        });
      }
    }
  }, []);

  const handleStartQuiz = () => {
    navigate("/quizmaster/quizzes");
  };

  const handleViewHistory = () => {
    navigate("/quizmaster/results");
  };

  const handleManageQuizzes = () => {
    navigate("/quizmaster/quizzes");
  };

  const handleSettings = () => {
    navigate("/quizmaster/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  // Admin-specific actions
  const adminActions = [
    {
      icon: <FaLayerGroup />,
      title: "Create Batch",
      description: "Create a new student batch",
      onClick: () => navigate("/quizmaster/create-batch"),
    },
    {
      icon: <FaBook />,
      title: "Create Quiz",
      description: "Create a new quiz for students",
      onClick: () => navigate("/quizmaster/create-quiz"),
    },
    {
      icon: <FaUsers />,
      title: "View Quizzes",
      description: "View all created quizzes",
      onClick: () => navigate("/quizmaster/quizzes"),
    },
    {
      icon: <FaChartLine />,
      title: "View Results",
      description: "View batch-wise results and analytics",
      onClick: () => navigate("/quizmaster/results"),
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
      title: "My Results",
      description: "View your quiz results and scores",
      onClick: handleViewHistory,
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
      className="min-h-screen transition-all duration-700 ease-in-out px-3 sm:px-4 py-12 sm:py-16 md:py-24"
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
        <div className="mb-6 sm:mb-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 min-w-0">Please select a batch to view quizzes
              <h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2
                           bg-clip-text text-transparent
                           bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                           break-words"
              >
                Welcome back, {user}!
              </h1>
              <p 
                className="text-base sm:text-lg opacity-80"
                style={{ color: "var(--text-color)" }}
              >
                {userType === "admin" ? "Manage your quiz platform" : "Ready to test your knowledge?"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <ActionButton
                variant="secondary"
                onClick={handleSettings}
                className="w-auto px-3 sm:px-4 text-sm sm:text-base flex-1 sm:flex-none"
              >
                <FaCog className="inline mr-1 sm:mr-2" />
                Settings
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={handleLogout}
                className="w-auto px-3 sm:px-4 text-sm sm:text-base flex-1 sm:flex-none"
              >
                <FaSignOutAlt className="inline mr-1 sm:mr-2" />
                Logout
              </ActionButton>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
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
        <div className="mb-6 sm:mb-8">
          <h2 
            className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6"
            style={{ color: "var(--text-color)" }}
          >
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
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
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div 
                      className="text-2xl sm:text-3xl opacity-80 flex-shrink-0" 
                      style={{ color: "var(--text-color)" }}
                    >
                      {action.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2"
                        style={{ color: "var(--text-color)" }}
                      >
                        {action.title}
                      </h3>
                      <p 
                        className="text-xs sm:text-sm opacity-70 break-words"
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
            <div className="mb-4 sm:mb-6">
              <h2 
                className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 px-2"
                style={{ color: "var(--text-color)" }}
              >
                {userType === "admin" ? "Manage Your Platform" : "Ready to Start?"}
              </h2>
              <p 
                className="text-base sm:text-lg opacity-80 mb-4 sm:mb-6 px-2"
                style={{ color: "var(--text-color)" }}
              >
                {userType === "admin" 
                  ? "Create and manage quizzes for your students" 
                  : "Take a quiz and test your knowledge 🎯"}
              </p>
            </div>
            <div className="max-w-md mx-auto px-2">
              <ActionButton 
                onClick={userType === "admin" ? handleManageQuizzes : handleStartQuiz}
                className="w-full sm:w-auto"
              >
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
