import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  updateActivity,
  getWeeklyProductivity,
  getWeeklyLeaderboard
} from "../services/api";
import axios from "axios";
import "../styles/MainDashboard.css";
import brainImg from "../assets/brain.png";

const MainDashboard = ({ user, userType, onLogout }) => {
  const navigate = useNavigate();
  const studentEmail = user?.email || user?.Gmail;

  // ================= STATE =================
  const [dashboardData, setDashboardData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [weeklySummary, setWeeklySummary] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // ================= REFS =================
  const timerRef = useRef(null);

  // ================= INIT SESSION START =================
  useEffect(() => {
    if (!studentEmail) return;

    let startTime = localStorage.getItem("sessionStartTime");

    if (!startTime) {
      startTime = Date.now();
      localStorage.setItem("sessionStartTime", startTime);
    }

    const updateTimer = () => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      setSessionSeconds(seconds);
    };

    updateTimer(); // immediate update

    if (!timerRef.current) {
      timerRef.current = setInterval(updateTimer, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [studentEmail]);

  // ================= WEEKLY SUMMARY =================
  const loadWeeklySummary = async () => {
    if (!studentEmail) return;
    try {
      const res = await getWeeklyProductivity(studentEmail);
      setWeeklySummary(res.data.weeklySummary || 0);
    } catch (err) {
      console.error("Weekly summary error:", err);
    }
  };

  useEffect(() => {
    loadWeeklySummary();
  }, [studentEmail]);

  // ================= LEADERBOARD =================
  const loadLeaderboard = async () => {
    try {
      const res = await getWeeklyLeaderboard();
      setLeaderboard(res.data.leaderboard || []);
    } catch (err) {
      console.error("Leaderboard error:", err);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  // ================= DASHBOARD DATA =================
  const loadDashboard = async () => {
    if (!studentEmail) return;
    try {
      const res = await axios.get(
        `http://localhost:9222/api/maindashboard/${studentEmail}`
      );
      setDashboardData(res.data.user);
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  // ================= ANNOUNCEMENTS =================
  const loadAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:9222/api/announcements");
      setAnnouncements(res.data.announcements || []);
    } catch (err) {
      console.error("Announcements error:", err);
    }
  };

  useEffect(() => {
    loadDashboard();
    loadAnnouncements();
  }, [studentEmail]);

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      const startTime = localStorage.getItem("sessionStartTime");
      if (studentEmail && startTime) {
        const totalSeconds = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        if (minutes > 0) {
          await updateActivity(studentEmail, minutes);
        }
      }
    } catch (err) {
      console.error("Logout activity save failed:", err);
    }

    clearInterval(timerRef.current);
    timerRef.current = null;

    localStorage.removeItem("sessionStartTime");
    setSessionSeconds(0);

    onLogout();
  };

  // ================= HELPERS =================
  const calculateDaysLeft = date => {
    const diff =
      new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const formatTime = seconds => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // ================= UI =================
  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <div className="top-header">
        <div className="left-section">
          <h1>Research Nexus</h1>
          <h2>
            Unlock Your Academic <br /> Potential
          </h2>
          <p>A Comprehensive Platform For Academic Mastery</p>
        </div>
        <div className="right-section">
          <img src={brainImg} alt="Brain" className="brain-img" />
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="dashboard-nav">
        <ul>
          <li><button onClick={() => navigate("/sites")}>Search & Discover</button></li>
          <li><button onClick={() => navigate("/tools")}>Research Tool</button></li>
          <li><Link to="/community">Community</Link></li>
          <li><button onClick={() => navigate("/profile")}>Profile</button></li>
          <li><button onClick={() => navigate("/files")}>File Management</button></li>
          <li><button onClick={() => navigate("/routine")}>Routine</button></li>

          {user?.Gmail === "authority@gmail.com" && (
            <li>
              <button onClick={() => navigate("/create-announcement")}>
                Create Announcement
              </button>
            </li>
          )}

          <li>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* DEADLINES */}
      <div className="deadline-section">
        <span className="bell-icon">🔔</span>
        <div className="announcement-list">
          {announcements.length === 0 && <p>No upcoming deadlines.</p>}
          {announcements.map(a => (
            <div key={a._id} className="announcement-item">
              <strong>{a.title}</strong> – {a.message}
              <br />
              <small>Only {calculateDaysLeft(a.date)} days left</small>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTIVITY */}
      <div className="productivity-section">
        <h3>Your Weekly Productivity</h3>
        <p>
          Total time this week: {Math.floor(weeklySummary / 60)}h{" "}
          {weeklySummary % 60}m
        </p>
        <h4>Current Session: {formatTime(sessionSeconds)}</h4>
      </div>

      {/* LEADERBOARD */}
      {leaderboard.length > 0 && (
        <div className="leaderboard-section">
          <h3>Weekly Leaderboard (Top 5)</h3>
          {leaderboard.map((s, i) => (
            <p key={s._id}>
              {i + 1}. {s.Name} — {Math.floor(s.weeklySummary / 60)}h{" "}
              {s.weeklySummary % 60}m
            </p>
          ))}
        </div>
      )}

      <footer className="dashboard-footer">
        <p>About Us</p>
        <p>Support</p>
        <p>Terms</p>
      </footer>
    </div>
  );
};

export default MainDashboard;
