import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardCard from "../../components/dashboard/DashboardCard";
import ActionButton from "../../components/dashboard/ActionButton";
import { FaArrowLeft, FaTrophy, FaUser, FaCalendar, FaChartLine } from "react-icons/fa";

const ViewResults = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [results, setResults] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("quiz"); // "quiz" or "batch"

  useEffect(() => {
    const user = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    
    if (!user) {
      navigate("/quizmaster/login");
      return;
    }
    
    setUsername(user);
    setUserType(role?.toLowerCase() || "student");
    
    if (quizId) {
      setViewMode("quiz");
      fetchQuizResults(quizId);
    } else {
      setViewMode("batch");
      fetchBatches();
      fetchBatchResults();
    }
  }, [quizId, navigate]);

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

  const fetchQuizResults = async (qId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/quizmaster/quizzes/${qId}/results/?username=${username}`
      );
      const data = await response.json();
      
      if (response.ok) {
        setQuizTitle(data.quiz_title);
        setResults(data.results || []);
      } else {
        alert(data.error || "Error loading results");
      }
    } catch (error) {
      alert("Error loading results: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatchResults = async (batch = null) => {
    if (userType !== "admin") return;
    
    setLoading(true);
    try {
      let url = `http://127.0.0.1:8000/api/quizmaster/results/batch/?username=${username}`;
      if (batch) {
        url += `&batch=${batch}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        // Flatten batch results for display
        const flattenedResults = [];
        data.batch_results.forEach((batchResult) => {
          Object.keys(batchResult.quizzes).forEach((quizTitle) => {
            batchResult.quizzes[quizTitle].forEach((result) => {
              flattenedResults.push({
                ...result,
                batch: batchResult.batch,
              });
            });
          });
        });
        setResults(flattenedResults);
      }
    } catch (error) {
      console.error("Error fetching batch results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchChange = (e) => {
    const batch = e.target.value;
    setSelectedBatch(batch);
    if (viewMode === "batch") {
      fetchBatchResults(batch);
    } else if (quizId) {
      // Re-fetch quiz results with batch filter (if needed)
      fetchQuizResults(quizId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  if (loading) {
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
          <p style={{ color: "var(--text-color)" }}>Loading results...</p>
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
            {viewMode === "quiz" ? (quizTitle || "Quiz Results") : "Batch Results"}
          </h1>
        </div>

        {/* Batch Filter for Admin */}
        {userType === "admin" && viewMode === "batch" && (
          <DashboardCard className="mb-6">
            <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-color)" }}>
              Filter by Batch
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

        {/* Results */}
        {results.length === 0 ? (
          <DashboardCard>
            <p style={{ color: "var(--text-color)" }}>No results found</p>
          </DashboardCard>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => (
              <DashboardCard key={result.id || index}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FaUser className="opacity-70" style={{ color: "var(--text-color)" }} />
                      <h3 className="text-lg font-semibold" style={{ color: "var(--text-color)" }}>
                        {result.student_username}
                      </h3>
                      {result.batch && (
                        <span className="text-sm opacity-70 px-2 py-1 rounded bg-indigo-500/20" style={{ color: "var(--text-color)" }}>
                          Batch: {result.batch}
                        </span>
                      )}
                    </div>
                    {result.quiz_title && (
                      <p className="text-sm opacity-70 mb-2" style={{ color: "var(--text-color)" }}>
                        Quiz: {result.quiz_title}
                      </p>
                    )}
                    {result.submitted_at && (
                      <div className="flex items-center gap-2 text-sm opacity-70" style={{ color: "var(--text-color)" }}>
                        <FaCalendar />
                        <span>Submitted: {formatDate(result.submitted_at)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="text-center sm:text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <FaChartLine className="opacity-70" style={{ color: "var(--text-color)" }} />
                        <span className="text-sm opacity-70" style={{ color: "var(--text-color)" }}>
                          Score:
                        </span>
                      </div>
                      <div className={`text-2xl font-bold ${getGradeColor(result.percentage)}`}>
                        {result.score} / {result.total_points}
                      </div>
                      <div className={`text-lg font-semibold ${getGradeColor(result.percentage)}`}>
                        {result.percentage.toFixed(2)}%
                      </div>
                    </div>

                    {result.time_taken_minutes !== undefined && (
                      <div className="text-center sm:text-right">
                        <div className="text-sm opacity-70 mb-1" style={{ color: "var(--text-color)" }}>
                          Time Taken:
                        </div>
                        <div className="text-lg font-semibold" style={{ color: "var(--text-color)" }}>
                          {result.time_taken_minutes} min
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-center">
                      <FaTrophy
                        className={`text-3xl ${
                          result.percentage >= 80
                            ? "text-yellow-500"
                            : result.percentage >= 60
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </DashboardCard>
            ))}
          </div>
        )}

        {/* Summary Stats for Admin */}
        {userType === "admin" && results.length > 0 && (
          <DashboardCard className="mt-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--text-color)" }}>
              Summary Statistics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-sm opacity-70" style={{ color: "var(--text-color)" }}>
                  Total Attempts
                </div>
                <div className="text-2xl font-bold" style={{ color: "var(--text-color)" }}>
                  {results.length}
                </div>
              </div>
              <div>
                <div className="text-sm opacity-70" style={{ color: "var(--text-color)" }}>
                  Average Score
                </div>
                <div className="text-2xl font-bold" style={{ color: "var(--text-color)" }}>
                  {results.length > 0
                    ? (results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(2)
                    : 0}%
                </div>
              </div>
              <div>
                <div className="text-sm opacity-70" style={{ color: "var(--text-color)" }}>
                  Highest Score
                </div>
                <div className="text-2xl font-bold text-green-500">
                  {results.length > 0
                    ? Math.max(...results.map((r) => r.percentage)).toFixed(2)
                    : 0}%
                </div>
              </div>
              <div>
                <div className="text-sm opacity-70" style={{ color: "var(--text-color)" }}>
                  Lowest Score
                </div>
                <div className="text-2xl font-bold text-red-500">
                  {results.length > 0
                    ? Math.min(...results.map((r) => r.percentage)).toFixed(2)
                    : 0}%
                </div>
              </div>
            </div>
          </DashboardCard>
        )}
      </div>
    </div>
  );
};

export default ViewResults;

