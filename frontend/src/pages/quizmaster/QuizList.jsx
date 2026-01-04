import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../../components/dashboard/DashboardCard";
import ActionButton from "../../components/dashboard/ActionButton";
import { FaArrowLeft, FaPlay, FaClock, FaBook, FaCalendar } from "react-icons/fa";

const QuizList = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userBatch, setUserBatch] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    
    if (!user) {
      navigate("/quizmaster/login");
      return;
    }
    
    setUsername(user);
    setUserType(role?.toLowerCase() || "student");
    const savedBatch = localStorage.getItem("userBatch");
    if (savedBatch) {
      setUserBatch(savedBatch);
      setSelectedBatch(savedBatch);
    }
    fetchBatches();
  }, [navigate]);

  useEffect(() => {
    if (username) {
      if (userType === "admin") {
        fetchQuizzes(selectedBatch || null);
      } else if (userBatch || selectedBatch) {
        fetchQuizzes(selectedBatch || userBatch);
      }
    }
  }, [username, userType, userBatch, selectedBatch]);

  const fetchBatches = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/quizmaster/batches/");
      if (response.ok) {
        const data = await response.json();
        setBatches(data.batches || []);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const fetchQuizzes = async (batch = null) => {
    setLoading(true);
    try {
      let url = `http://127.0.0.1:8000/api/quizmaster/quizzes/?username=${username}`;
      if (batch) {
        url += `&batch=${batch}`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data.quizzes || []);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchChange = (e) => {
    const batch = e.target.value;
    setSelectedBatch(batch);
    if (userType === "student") {
      // Update user's batch in localStorage and fetch quizzes
      localStorage.setItem("userBatch", batch);
      setUserBatch(batch);
      fetchQuizzes(batch);
    } else {
      fetchQuizzes(batch);
    }
  };

  const handleStartQuiz = (quizId) => {
    if (userType === "student" && !selectedBatch && !userBatch) {
      alert("Please select a batch first");
      return;
    }
    navigate(`/quizmaster/take-quiz/${quizId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const isQuizAvailable = (quiz) => {
    const now = new Date();
    if (quiz.start_date && new Date(quiz.start_date) > now) {
      return { available: false, message: "Not started yet" };
    }
    if (quiz.end_date && new Date(quiz.end_date) < now) {
      return { available: false, message: "Expired" };
    }
    return { available: true };
  };

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
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <ActionButton
            variant="secondary"
            onClick={() => navigate("/quizmaster/dashboard")}
            className="w-auto px-4"
          >
            <FaArrowLeft className="inline mr-2" />
            Back
          </ActionButton>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-color)" }}>
            {userType === "admin" ? "All Quizzes" : "Available Quizzes"}
          </h1>
        </div>

        {/* Batch Selection for Students */}
        {userType === "student" && (
          <DashboardCard className="mb-6">
            <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-color)" }}>
              Select Your Batch
            </h2>
            <select
              value={selectedBatch || userBatch || localStorage.getItem("userBatch") || ""}
              onChange={handleBatchChange}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/10 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ color: "var(--text-color)" }}
            >
              <option value="">Select Batch</option>
              {batches.map((batch) => (
                <option key={batch.batch_code} value={batch.batch_code}>
                  {batch.name} ({batch.batch_code})
                </option>
              ))}
            </select>
            {(!selectedBatch && !userBatch && !localStorage.getItem("userBatch")) && (
              <p className="mt-2 text-sm opacity-70" style={{ color: "var(--text-color)" }}>
                Please select your batch to view available quizzes
              </p>
            )}
          </DashboardCard>
        )}

        {/* Batch Filter for Admin */}
        {userType === "admin" && (
          <DashboardCard className="mb-6">
            <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-color)" }}>
              Filter by Batch (Optional)
            </h2>
            <select
              value={selectedBatch}
              onChange={handleBatchChange}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/10 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ color: "var(--text-color)" }}
            >
              <option value="">All Batches</option>
              {batches.map((batch) => (
                <option key={batch.batch_code} value={batch.batch_code}>
                  {batch.name} ({batch.batch_code})
                </option>
              ))}
            </select>
          </DashboardCard>
        )}

        {/* Quizzes List */}
        {loading ? (
          <DashboardCard>
            <p style={{ color: "var(--text-color)" }}>Loading quizzes...</p>
          </DashboardCard>
        ) : quizzes.length === 0 ? (
          <DashboardCard>
            <p style={{ color: "var(--text-color)" }}>
              {userType === "student" && !selectedBatch && !userBatch
                ? "Please select a batch to view quizzes"
                : "No quizzes available"}
            </p>
          </DashboardCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => {
              const availability = isQuizAvailable(quiz);
              return (
                <DashboardCard key={quiz.id}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-color)" }}>
                        {quiz.title}
                      </h3>
                      {quiz.description && (
                        <p className="text-sm opacity-70 mb-2" style={{ color: "var(--text-color)" }}>
                          {quiz.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-color)" }}>
                      <FaBook className="opacity-70" />
                      <span>Batch: {quiz.batch}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-color)" }}>
                      <FaClock className="opacity-70" />
                      <span>{quiz.duration_minutes} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-color)" }}>
                      <span className="opacity-70">Points:</span>
                      <span>{quiz.total_points}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-color)" }}>
                      <span className="opacity-70">Questions:</span>
                      <span>{quiz.question_count || 0}</span>
                    </div>
                    {quiz.start_date && (
                      <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-color)" }}>
                        <FaCalendar className="opacity-70" />
                        <span>Starts: {formatDate(quiz.start_date)}</span>
                      </div>
                    )}
                    {quiz.end_date && (
                      <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-color)" }}>
                        <FaCalendar className="opacity-70" />
                        <span>Ends: {formatDate(quiz.end_date)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {userType === "student" ? (
                      <ActionButton
                        onClick={() => handleStartQuiz(quiz.id)}
                        className="flex-1"
                        disabled={!availability.available || (!selectedBatch && !userBatch && !localStorage.getItem("userBatch"))}
                      >
                        <FaPlay className="inline mr-2" />
                        {availability.available ? "Start Quiz" : availability.message}
                      </ActionButton>
                    ) : (
                      <ActionButton
                        onClick={() => navigate(`/quizmaster/quiz/${quiz.id}/results`)}
                        className="flex-1"
                        variant="secondary"
                      >
                        View Results
                      </ActionButton>
                    )}
                  </div>
                </DashboardCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;

