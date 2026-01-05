const Student = require("../models/Student");

// ================= UPDATE ACTIVITY (ONLY ON LOGOUT) =================
exports.updateActivity = async (req, res) => {
  try {
    const { email, minutesSpent } = req.body;
    const today = new Date().toISOString().slice(0, 10);

    const student = await Student.findOne({ Gmail: email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const todayActivity = student.dailyActivity.find(
      a => a.date === today
    );

    if (todayActivity) {
      todayActivity.minutesSpent += minutesSpent;
    } else {
      student.dailyActivity.push({
        date: today,
        minutesSpent
      });
    }

    await student.save();

    res.status(200).json({ message: "Session activity saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= WEEKLY SUMMARY (READ ONLY) =================
exports.getWeeklySummary = async (req, res) => {
  try {
    const { email } = req.params;

    const student = await Student.findOne({ Gmail: email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const today = new Date();
    const last7Days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      last7Days.push(d.toISOString().slice(0, 10));
    }

    const weeklyMinutes = student.dailyActivity
      .filter(a => last7Days.includes(a.date))
      .reduce((sum, a) => sum + a.minutesSpent, 0);

    res.status(200).json({ weeklySummary: weeklyMinutes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= LEADERBOARD =================
exports.getWeeklyLeaderboard = async (req, res) => {
  try {
    const students = await Student.find()
      .select("Name weeklySummary Gmail dailyActivity");

    const leaderboard = students
      .map(s => {
        const today = new Date();
        const last7Days = [];

        for (let i = 0; i < 7; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          last7Days.push(d.toISOString().slice(0, 10));
        }

        const weeklyMinutes = s.dailyActivity
          .filter(a => last7Days.includes(a.date))
          .reduce((sum, a) => sum + a.minutesSpent, 0);

        return {
          _id: s._id,
          Name: s.Name,
          weeklySummary: weeklyMinutes
        };
      })
      .sort((a, b) => b.weeklySummary - a.weeklySummary)
      .slice(0, 5);

    res.status(200).json({ leaderboard });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
