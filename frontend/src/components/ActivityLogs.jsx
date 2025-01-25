import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import classNames from "classnames";

const socket = io("http://localhost:5001", {
  withCredentials: true, // Ensure credentials are sent if needed
});

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);

  const getActionClass = (action) => {
    switch (action) {
      case "Create":
        return "primaryBtn"; // Green background for Create
      case "Delete":
        return "quaternaryBtn"; // Red background for Delete
      case "Download_E":
        return "secondaryBtn"; // Blue background for Download_E
      case "Download":
        return "secondaryBtn"; // Darker blue for Download
      case "Trash":
        return "quaternaryBtn"; // Yellow for Trash
      case "Login":
        return "tertiaryBtn"; // Gray for Login
      default:
        return "quinaryBtn"; // Default gray for unrecognized actions
    }
  };

  useEffect(() => {
    socket.emit("getAllActivities");

    socket.on("newActivity", (log) => {
      setLogs((prevLogs) => [...prevLogs, log]);
      console.log("New log received:", log);
    });

    // Listen for the 'allActivities' event
    socket.on("allActivities", (existingLogs) => {
      setLogs(existingLogs);
    });

    return () => {
      socket.off("newActivity");
      socket.off("allActivities");
    };
  }, []);

  return (
    <div>
      <h2 className="mt-4">Activity Logs</h2>
      <div className="desc flex gap-1 items-center mb-4 text-sm text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={18}
          height={18}
          viewBox="0 0 24 24"
        >
          <path
            fill="#9ca3af"
            d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
          ></path>
        </svg>
        <p className="mb-0">Activity Logs auto delete in 30 days.</p>
      </div>
      <div className="logslist">
        {logs.map((log) => (
          <div
            className="log shadow-md px-2 py-2 mb-4 flex gap-3 column-3"
            key={log._id}
          >
            <div className="left">
              <p className="font-bold text-xl mb-0">{log.user.fullname}</p>
              <p className="text-sm">
                {new Date(log.timestamp).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            </div>
            <div className="right">
              <p
                className={classNames(
                  "mb-0 inline-block px-2 py-1 rounded",
                  getActionClass(log.action)
                )}
              >
                {log.action}
              </p>
              <p className="">{log.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogs;
