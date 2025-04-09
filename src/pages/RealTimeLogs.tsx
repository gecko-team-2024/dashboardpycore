import React, { useEffect, useRef, useState } from "react";

const RealTimeLogs: React.FC = () => {
  const [logs, setLogs] = useState<string>("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket("wss://pycore.onrender.com/ws/logs");

    socketRef.current.onmessage = (event) => {
      setLogs((prevLogs) => prevLogs + event.data);
    };

    socketRef.current.onerror = (event) => {
      console.error("WebSocket error: ", event);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  return (
    <div style={{ margin: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Real-Time Server Logs</h1>
      <pre
        style={{
          backgroundColor: "#f4f4f4",
          padding: 10,
          border: "1px solid #ddd",
          borderRadius: 5,
          overflowY: "scroll",
          height: 400,
        }}
      >
        {logs}
      </pre>
    </div>
  );
};

export default RealTimeLogs;
