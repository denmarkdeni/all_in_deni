import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardCard from "../../components/dashboard/DashboardCard";
import ActionButton from "../../components/dashboard/ActionButton";
import { FaArrowLeft, FaCheckCircle, FaClock, FaSave } from "react-icons/fa";

const TakeQuiz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [username, setUsername] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (!user) {
      navigate("/quizmaster/login");
      return;
    }
    setUsername(user);
  }, [navigate]);

  useEffect(() => {
    if (username && quizId) {
      fetchQuiz();
    }
  }, [username, quizId]);
  
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && !submitted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, submitted]);

  const fetchQuiz = async () => {
    if (!username || !quizId) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/quizmaster/quizzes/${quizId}/?username=${username}`
      );
      const data = await response.json();
      
      if (response.ok) {
        setQuiz(data.quiz);
        setAnswers(new Array(data.quiz.questions.length).fill(null));
        
        // Start the quiz attempt
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/e96703f0-0784-4b75-a281-3e425ac96b14',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TakeQuiz.jsx:65',message:'Starting quiz POST request',data:{url:'http://127.0.0.1:8000/api/quizmaster/quizzes/start/',method:'POST',username,quiz_id:quizId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        const startResponse = await fetch("http://127.0.0.1:8000/api/quizmaster/quizzes/start/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            quiz_id: quizId,
          }),
        });
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/e96703f0-0784-4b75-a281-3e425ac96b14',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TakeQuiz.jsx:73',message:'Quiz start response received',data:{status:startResponse.status,statusText:startResponse.statusText,ok:startResponse.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion

        if (startResponse.ok) {
          const startData = await startResponse.json();
          setStartedAt(new Date(startData.started_at));
          setTimeRemaining(data.quiz.duration_minutes * 60);
        }
      } else {
        alert(data.error || "Error loading quiz");
        navigate("/quizmaster/quizzes");
      }
    } catch (error) {
      alert("Error loading quiz: " + error.message);
      navigate("/quizmaster/quizzes");
    } finally {
      setLoading(false);
    }
  };


  const handleAnswerChange = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    if (!window.confirm("Are you sure you want to submit? You cannot change your answers after submission.")) {
      return;
    }

    setSubmitting(true);
    try {
      // Fill any unanswered questions with -1
      const finalAnswers = answers.map((ans) => (ans === null ? -1 : ans));

      const response = await fetch("http://127.0.0.1:8000/api/quizmaster/quizzes/submit/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          quiz_id: quizId,
          answers: finalAnswers,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setResult(data);
      } else {
        alert(data.error || "Error submitting quiz");
      }
    } catch (error) {
      alert("Error submitting quiz: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = async () => {
    if (submitted) return;
    
    const finalAnswers = answers.map((ans) => (ans === null ? -1 : ans));
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/quizmaster/quizzes/submit/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          quiz_id: quizId,
          answers: finalAnswers,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
        setResult(data);
        alert("Time's up! Quiz submitted automatically.");
      }
    } catch (error) {
      console.error("Error auto-submitting:", error);
    }
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
          <p style={{ color: "var(--text-color)" }}>Loading quiz...</p>
        </DashboardCard>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  if (submitted && result) {
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
        <div className="max-w-4xl mx-auto">
          <DashboardCard className="text-center">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-color)" }}>
              Quiz Submitted Successfully!
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-2xl font-bold" style={{ color: "var(--text-color)" }}>
                  Score: {result.score} / {result.total_points}
                </p>
                <p className="text-xl mt-2" style={{ color: "var(--text-color)" }}>
                  Percentage: {result.percentage.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <ActionButton
                variant="secondary"
                onClick={() => navigate("/quizmaster/quizzes")}
              >
                Back to Quizzes
              </ActionButton>
              <ActionButton
                onClick={() => navigate(`/quizmaster/quiz/${quizId}/results`)}
              >
                View Detailed Results
              </ActionButton>
            </div>
          </DashboardCard>
        </div>
      </div>
    );
  }

  const answeredCount = answers.filter((ans) => ans !== null).length;
  const totalQuestions = quiz.questions.length;

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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--text-color)" }}>
                {quiz.title}
              </h1>
              {quiz.description && (
                <p className="opacity-70" style={{ color: "var(--text-color)" }}>
                  {quiz.description}
                </p>
              )}
            </div>
            {timeRemaining !== null && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20">
                <FaClock className="text-red-500" />
                <span className="font-bold text-red-500">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <ActionButton
              variant="secondary"
              onClick={() => navigate("/quizmaster/quizzes")}
              className="w-auto px-4"
            >
              <FaArrowLeft className="inline mr-2" />
              Back
            </ActionButton>
            <div className="text-sm opacity-70" style={{ color: "var(--text-color)" }}>
              Progress: {answeredCount} / {totalQuestions} answered
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-6">
          {quiz.questions.map((question, qIndex) => (
            <DashboardCard key={qIndex}>
              <div className="mb-4">
                <div className="flex items-start gap-2 mb-2">
                  <span className="font-semibold" style={{ color: "var(--text-color)" }}>
                    Question {qIndex + 1}:
                  </span>
                  <span className="text-sm opacity-70" style={{ color: "var(--text-color)" }}>
                    ({question.points} point{question.points !== 1 ? "s" : ""})
                  </span>
                </div>
                <p className="text-lg mb-4" style={{ color: "var(--text-color)" }}>
                  {question.question_text}
                </p>
              </div>

              <div className="space-y-2">
                {question.options.map((option, oIndex) => (
                  <label
                    key={oIndex}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                      ${answers[qIndex] === oIndex
                        ? "bg-indigo-500/30 border-2 border-indigo-500"
                        : "bg-white/10 dark:bg-black/10 border-2 border-transparent hover:bg-white/20 dark:hover:bg-black/20"
                      }`}
                  >
                    <input
                      type="radio"
                      name={`question_${qIndex}`}
                      checked={answers[qIndex] === oIndex}
                      onChange={() => handleAnswerChange(qIndex, oIndex)}
                      className="w-4 h-4"
                    />
                    <span style={{ color: "var(--text-color)" }}>{option}</span>
                  </label>
                ))}
              </div>
            </DashboardCard>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <ActionButton
            variant="secondary"
            onClick={() => navigate("/quizmaster/quizzes")}
            className="flex-1"
          >
            Cancel
          </ActionButton>
          <ActionButton
            onClick={handleSubmit}
            className="flex-1"
            disabled={submitting}
          >
            <FaSave className="inline mr-2" />
            {submitting ? "Submitting..." : "Submit Quiz"}
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;

