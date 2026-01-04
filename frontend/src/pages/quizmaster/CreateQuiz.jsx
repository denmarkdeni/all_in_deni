import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../../components/dashboard/DashboardCard";
import ActionButton from "../../components/dashboard/ActionButton";
import AuthInput from "../../components/auth/AuthInput";
import { FaPlus, FaTrash, FaArrowLeft, FaSave } from "react-icons/fa";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    batch: "",
    duration_minutes: 30,
    start_date: "",
    end_date: "",
    questions: [
      {
        question_text: "",
        options: ["", "", "", ""],
        correct_answer: 0,
        points: 1,
      },
    ],
  });

  useEffect(() => {
    const user = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    
    if (!user || role?.toLowerCase() !== "admin") {
      navigate("/quizmaster/dashboard");
      return;
    }
    
    setUsername(user);
    fetchBatches();
  }, [navigate]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index][field] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          question_text: "",
          options: ["", "", "", ""],
          correct_answer: 0,
          points: 1,
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    if (quizData.questions.length > 1) {
      const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
      setQuizData({ ...quizData, questions: updatedQuestions });
    }
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options.push("");
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...quizData.questions];
    if (updatedQuestions[questionIndex].options.length > 2) {
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      // Adjust correct_answer if needed
      if (updatedQuestions[questionIndex].correct_answer >= updatedQuestions[questionIndex].options.length) {
        updatedQuestions[questionIndex].correct_answer = updatedQuestions[questionIndex].options.length - 1;
      }
      setQuizData({ ...quizData, questions: updatedQuestions });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!quizData.title || !quizData.batch) {
      alert("Please fill in title and batch");
      setLoading(false);
      return;
    }

    if (quizData.questions.length === 0) {
      alert("Please add at least one question");
      setLoading(false);
      return;
    }

    for (let i = 0; i < quizData.questions.length; i++) {
      const q = quizData.questions[i];
      if (!q.question_text) {
        alert(`Question ${i + 1} text is required`);
        setLoading(false);
        return;
      }
      const validOptions = q.options.filter(opt => opt.trim() !== "");
      if (validOptions.length < 2) {
        alert(`Question ${i + 1} must have at least 2 options`);
        setLoading(false);
        return;
      }
      if (q.correct_answer < 0 || q.correct_answer >= validOptions.length) {
        alert(`Question ${i + 1} has invalid correct answer selection`);
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        username,
        title: quizData.title,
        description: quizData.description,
        batch: quizData.batch,
        duration_minutes: parseInt(quizData.duration_minutes),
        questions: quizData.questions.map((q) => ({
          question_text: q.question_text,
          options: q.options.filter(opt => opt.trim() !== ""),
          correct_answer: q.correct_answer,
          points: parseInt(q.points) || 1,
        })),
      };

      if (quizData.start_date) {
        payload.start_date = new Date(quizData.start_date).toISOString();
      }
      if (quizData.end_date) {
        payload.end_date = new Date(quizData.end_date).toISOString();
      }

      const response = await fetch("http://127.0.0.1:8000/api/quizmaster/quizzes/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Quiz created successfully!");
        navigate("/quizmaster/dashboard");
      } else {
        alert(data.error || "Error creating quiz");
      }
    } catch (error) {
      alert("Error creating quiz: " + error.message);
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-4xl mx-auto">
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
            Create New Quiz
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <DashboardCard className="mb-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--text-color)" }}>
              Quiz Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-color)" }}>
                  Quiz Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={quizData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/10 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ color: "var(--text-color)" }}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-color)" }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={quizData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/10 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ color: "var(--text-color)" }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-color)" }}>
                    Batch *
                  </label>
                  <select
                    name="batch"
                    value={quizData.batch}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/10 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{ color: "var(--text-color)" }}
                  >
                    <option value="">Select Batch</option>
                    {batches.map((batch) => (
                      <option key={batch.batch_code} value={batch.batch_code}>
                        {batch.name} ({batch.batch_code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-color)" }}>
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    name="duration_minutes"
                    value={quizData.duration_minutes}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/10 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{ color: "var(--text-color)" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-color)" }}>
                    Start Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    name="start_date"
                    value={quizData.start_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/10 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{ color: "var(--text-color)" }}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-color)" }}>
                    End Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    value={quizData.end_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/10 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{ color: "var(--text-color)" }}
                  />
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Questions */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold" style={{ color: "var(--text-color)" }}>
                Questions
              </h2>
              <ActionButton
                variant="secondary"
                onClick={addQuestion}
                className="w-auto px-4"
              >
                <FaPlus className="inline mr-2" />
                Add Question
              </ActionButton>
            </div>

            {quizData.questions.map((question, qIndex) => (
              <DashboardCard key={qIndex} className="mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium" style={{ color: "var(--text-color)" }}>
                    Question {qIndex + 1}
                  </h3>
                  {quizData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-color)" }}>
                      Question Text *
                    </label>
                    <textarea
                      value={question.question_text}
                      onChange={(e) => handleQuestionChange(qIndex, "question_text", e.target.value)}
                      required
                      rows="2"
                      className="w-full px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/10 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      style={{ color: "var(--text-color)" }}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-color)" }}>
                      Options *
                    </label>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2 mb-2">
                        <input
                          type="radio"
                          name={`correct_${qIndex}`}
                          checked={question.correct_answer === oIndex}
                          onChange={() => handleQuestionChange(qIndex, "correct_answer", oIndex)}
                          className="w-4 h-4"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                          className="flex-1 px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/10 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          style={{ color: "var(--text-color)" }}
                        />
                        {question.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(qIndex, oIndex)}
                            className="text-red-500 hover:text-red-700 px-2"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="text-sm text-indigo-500 hover:text-indigo-700 mt-2"
                    >
                      + Add Option
                    </button>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-color)" }}>
                      Points
                    </label>
                    <input
                      type="number"
                      value={question.points}
                      onChange={(e) => handleQuestionChange(qIndex, "points", parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-24 px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/10 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      style={{ color: "var(--text-color)" }}
                    />
                  </div>
                </div>
              </DashboardCard>
            ))}
          </div>

          <div className="flex gap-4">
            <ActionButton
              variant="secondary"
              onClick={() => navigate("/quizmaster/dashboard")}
              className="flex-1"
            >
              Cancel
            </ActionButton>
            <ActionButton
              type="submit"
              onClick={handleSubmit}
              className="flex-1"
              disabled={loading}
            >
              <FaSave className="inline mr-2" />
              {loading ? "Creating..." : "Create Quiz"}
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;

