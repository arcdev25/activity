import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://revised-kernel-frequency-structures.trycloudflare.com");
function App() {
  const [users, setUsers] = useState({});

  useEffect(() => {
    socket.on("live-users", (data) => {
      setUsers(data);
    });

    return () => {
      socket.off("live-users");
    };
  }, []);

  return (
    <div
      style={{
        padding: 12,
        fontFamily: "Arial",
        width: "100%",
        height: "100vh",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >

      <table
        border="1"
        cellPadding="6"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
          fontSize: "13px",
        }}
      >
       <thead>
          <tr>
            <th>Device</th>
            <th>Online</th>
            <th>Status</th>
            <th>Application</th>
            <th>Keys</th>
            <th>Clicks</th>
            <th>Scrolls</th>
            <th>Moves</th>
            <th>Score</th>
            <th>Last Seen</th>
          </tr>
        </thead>

        <tbody>
          {Object.values(users)
            .sort((a, b) => {
              const nameA = (a.deviceName || a.userId || "").toLowerCase();
              const nameB = (b.deviceName || b.userId || "").toLowerCase();
              return nameA.localeCompare(nameB);
            })
            .map((user) => (
            <tr key={user.userId}>
              <td>{user.deviceName || user.userId}</td>

              <td>
                {user.isOnline ? (
                  <span style={{ color: "#22c55e", fontWeight: "bold" }}>● Online</span>
                ) : (
                  <span style={{ color: "#ef4444", fontWeight: "bold" }}>● Offline</span>
                )}
              </td>

              <td>
                {user.status === "Working" ? (
                  <span style={{ color: "#22c55e", fontWeight: "bold" }}>
                    🟢 Working
                  </span>
                ) : user.status === "Suspicious" ? (
                  <span style={{ color: "#f59e0b", fontWeight: "bold" }}>
                    🟡 Suspicious
                  </span>
                ) : (
                  <span style={{ color: "#9ca3af", fontWeight: "bold" }}>
                    ⚪ Idle
                  </span>
                )}
              </td>
              <td>{user.activeWindow}</td>
              <td>{user.keyboardCount || 0}</td>
              <td>{user.mouseClickCount || 0}</td>
              <td>{user.mouseScrollCount || 0}</td>
              <td>{user.mouseMoveCount || 0}</td>
              <td>{user.score || 0}</td>
              <td>{new Date(user.lastSeen).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;