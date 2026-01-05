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
import { useActivityTracker } from "../hooks/useActivityTracker";

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

  // ================= ACTIVITY TRACKER =================
  useActivityTracker(studentEmail, !!studentEmail);

  // ================= LOAD SAVED SESSION =================
  useEffect(() => {
    const saved = localStorage.getItem("sessionSeconds");
    if (saved) {
      setSessionSeconds(parseInt(saved));
    }
  }, []);

  // ================= REAL-TIME TIMER (STRICT MODE SAFE) =================
  useEffect(() => {
    if (!studentEmail) return;

    if (timerRef.current) return; // prevent double timer

    timerRef.current = setInterval(() => {
      setSessionSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [studentEmail]);

  // ================= PERSIST SESSION =================
  useEffect(() => {
    localStorage.setItem("sessionSeconds", sessionSeconds);
  }, [sessionSeconds]);

  // ================= SAVE ACTIVITY EVERY 1 MINUTE =================
  useEffect(() => {
    if (!studentEmail) return;

    if (sessionSeconds > 0 && sessionSeconds % 60 === 0) {
      updateActivity(studentEmail, 1).catch(err =>
        console.error("Activity update failed:", err)
      );
    }
  }, [sessionSeconds, studentEmail]);

  // ================= WEEKLY SUMMARY =================
  const loadWeeklySummary = async () => {
    if (!studentEmail) return;
    try {
      const res = await getWeeklyProductivity(studentEmail);
      setWeeklySummary(res.data.weeklySummary);
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
      setLeaderboard(res.data.leaderboard);
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
      setAnnouncements(res.data.announcements);
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
    if (studentEmail && sessionSeconds > 0) {
      const minutes = Math.floor(sessionSeconds / 60);
      if (minutes > 0) {
        await updateActivity(studentEmail, minutes);
      }
    }

    clearInterval(timerRef.current);
    timerRef.current = null;

    localStorage.removeItem("sessionSeconds");
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
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
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
