const ActivityLog = require("../model/ActivityLog.model");

const logActivity = async (
  userId,
  action,
  target = "",
  details = "",
  socket
) => {
  try {
    const retentionPeriod = 30 * 24 * 60 * 60 * 1000; // 30 days
    const expiresAt = new Date(Date.now() + retentionPeriod);
    const log = new ActivityLog({
      user: userId,
      action,
      target,
      details,
      expiresAt,
    });

    await log.save();

    socket.emit("newActivity", log);
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

const sendAllLogs = async (socket) => {
  try {
    //populate the user field in the logs only fullname and email
    const logs = await ActivityLog.find({ expiresAt: { $gte: new Date() } })
      .sort({ timestamp: -1 })
      .populate("user", "fullname email");
    socket.emit("allActivities", logs);
  } catch (error) {
    console.error("Error sending all logs:", error);
  }

  socket.on("getAllActivities", () => {
    sendAllLogs(socket);
  });
};

module.exports = {
  logActivity,
  sendAllLogs,
};
