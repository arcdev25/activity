import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://art-pricing-complement-sum.trycloudflare.com");
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
            <th>Active</th>
            <th>Keyboard / min</th>
            <th>Mouse / min</th>
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
              <td style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.deviceName || user.userId}</td>
              <td>
                {user.isOnline ? (
                  <span style={{ color: "#22c55e", fontWeight: "bold" }}>
                    ● Online
                  </span>
                ) : (
                  <span style={{ color: "#ef4444", fontWeight: "bold" }}>
                    ● Offline
                  </span>
                )}
              </td>

              <td>
                {user.isActive ? (
                  <span style={{ color: "#3b82f6", fontWeight: "bold" }}>
                    ● Active
                  </span>
                ) : (
                  <span style={{ color: "#a1a1aa", fontWeight: "bold" }}>
                    ● Idle
                  </span>
                )}
              </td>
              <td style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.keyboardCount}</td>
              <td style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.mouseCount}</td>
              <td style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{new Date(user.lastSeen).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;