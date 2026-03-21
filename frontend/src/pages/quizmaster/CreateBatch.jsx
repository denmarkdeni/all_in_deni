import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../../components/dashboard/DashboardCard";
import ActionButton from "../../components/dashboard/ActionButton";
import { FaArrowLeft, FaSave, FaCalendar } from "react-icons/fa";
import api from "../../api/client";

const CreateBatch = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [batchData, setBatchData] = useState({
    batch_code: "",
    name: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    
    if (!user || role?.toLowerCase() !== "admin") {
      navigate("/quizmaster/dashboard");
      return;
    }
    
    setUsername(user);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBatchData({ ...batchData, [name]: value });
  };

  const generateBatchCode = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const handleGenerateCode = () => {
    setBatchData({ ...batchData, batch_code: generateBatchCode() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!batchData.batch_code || !batchData.name) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Validate batch code format (YYYY-MM)
    const batchCodePattern = /^\d{4}-\d{2}$/;
    if (!batchCodePattern.test(batchData.batch_code)) {
      alert("Batch code must be in format YYYY-MM (e.g., 2024-01)");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/quizmaster/batches/create/', batchData);

      const data = await response.data;

      if (response.status >= 200 && response.status < 300) {
        alert("Batch created successfully!");
        navigate("/quizmaster/dashboard");
      } else {
        alert(`Error creating batch: ${response.data.error}`);
      }
    } catch (error) {
      if (error.response && error.response.data?.error) {
        alert(`Error creating batch: ${error.response.data.error}`);
      } else {
        alert('Error creating batch!');
      }
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
      <div className="max-w-2xl mx-auto">
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
            Create New Batch
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <DashboardCard>
            <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-color)" }}>
              Batch Details
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-color)" }}>
                  Batch Code *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="batch_code"
                    value={batchData.batch_code}
                    onChange={handleInputChange}
                    placeholder="YYYY-MM (e.g., 2024-01)"
                    required
                    pattern="\d{4}-\d{2}"
                    className="flex-1 px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/10 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{ color: "var(--text-color)" }}
                  />
                  <ActionButton
                    type="button"
                    variant="secondary"
                    onClick={handleGenerateCode}
                    className="w-auto px-4"
                  >
                    <FaCalendar className="inline mr-2" />
                    Auto
                  </ActionButton>
                </div>
                <p className="mt-2 text-xs opacity-70" style={{ color: "var(--text-color)" }}>
                  Format: YYYY-MM (e.g., 2024-01 for January 2024)
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-color)" }}>
                  Batch Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={batchData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., January 2024 Batch"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/10 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ color: "var(--text-color)" }}
                />
                <p className="mt-2 text-xs opacity-70" style={{ color: "var(--text-color)" }}>
                  A descriptive name for this batch (e.g., "January 2024 Batch")
                </p>
              </div>
            </div>
          </DashboardCard>

          <div className="flex gap-4 mt-6">
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
              {loading ? "Creating..." : "Create Batch"}
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBatch;

