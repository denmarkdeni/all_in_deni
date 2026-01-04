import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../../components/dashboard/DashboardCard";
import ActionButton from "../../components/dashboard/ActionButton";
import { FaArrowLeft, FaSave, FaUser, FaEnvelope, FaLayerGroup, FaGraduationCap, FaInfoCircle } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [batches, setBatches] = useState([]);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    role: "",
    batch: "",
    full_name: "",
    education: "",
    other_info: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (!user) {
      navigate("/quizmaster/login");
      return;
    }
    setUsername(user);
  }, [navigate]);

  useEffect(() => {
    if (username) {
      fetchProfile();
      fetchBatches();
    }
  }, [username]);

  const fetchProfile = async () => {
    if (!username) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/quizmaster/profile/?username=${username}`
      );
      const data = await response.json();
      
      if (response.ok) {
        setProfileData(data.profile);
        // Update localStorage with batch if it exists
        if (data.profile.batch) {
          localStorage.setItem("userBatch", data.profile.batch);
        }
      } else {
        alert(data.error || "Error loading profile");
      }
    } catch (error) {
      alert("Error loading profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

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
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/quizmaster/profile/update/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: profileData.username,
          email: profileData.email,
          batch: profileData.batch,
          full_name: profileData.full_name,
          education: profileData.education,
          other_info: profileData.other_info,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");
        // Update localStorage with batch
        if (data.profile.batch) {
          localStorage.setItem("userBatch", data.profile.batch);
        }
        setProfileData(data.profile);
      } else {
        alert(data.error || "Error updating profile");
      }
    } catch (error) {
      alert("Error updating profile: " + error.message);
    } finally {
      setSaving(false);
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
          <p style={{ color: "var(--text-color)" }}>Loading profile...</p>
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
      <div className="max-w-3xl mx-auto">
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
            My Profile
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <DashboardCard>
            <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-color)" }}>
              Profile Information
            </h2>
            <div className="space-y-6">
              {/* Username (Read-only) */}
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-color)" }}>
                  <FaUser className="inline mr-2" />
                  Username
                </label>
                <input
                  type="text"
                  value={profileData.username}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/5 dark:bg-black/5 opacity-70 cursor-not-allowed"
                  style={{ color: "var(--text-color)" }}
                />
                <p className="mt-1 text-xs opacity-70" style={{ color: "var(--text-color)" }}>
                  Username cannot be changed
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-color)" }}>
                  <FaEnvelope className="inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/10 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ color: "var(--text-color)" }}
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-color)" }}>
                  <FaUser className="inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={profileData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/10 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ color: "var(--text-color)" }}
                />
              </div>

              {/* Batch Selection */}
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-color)" }}>
                  <FaLayerGroup className="inline mr-2" />
                  Batch *
                </label>
                <select
                  name="batch"
                  value={profileData.batch}
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
                <p className="mt-1 text-xs opacity-70" style={{ color: "var(--text-color)" }}>
                  Select your batch to access quizzes assigned to it
                </p>
              </div>

              {/* Education */}
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-color)" }}>
                  <FaGraduationCap className="inline mr-2" />
                  Education
                </label>
                <input
                  type="text"
                  name="education"
                  value={profileData.education}
                  onChange={handleInputChange}
                  placeholder="e.g., Bachelor's in Computer Science, High School, etc."
                  className="w-full px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/10 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ color: "var(--text-color)" }}
                />
              </div>

              {/* Other Info */}
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-color)" }}>
                  <FaInfoCircle className="inline mr-2" />
                  Additional Information
                </label>
                <textarea
                  name="other_info"
                  value={profileData.other_info}
                  onChange={handleInputChange}
                  placeholder="Any additional information about yourself..."
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/10 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ color: "var(--text-color)" }}
                />
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-color)" }}>
                  Role
                </label>
                <input
                  type="text"
                  value={profileData.role}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-indigo-400/40 bg-white/5 dark:bg-black/5 opacity-70 cursor-not-allowed"
                  style={{ color: "var(--text-color)" }}
                />
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
              disabled={saving}
            >
              <FaSave className="inline mr-2" />
              {saving ? "Saving..." : "Save Profile"}
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

