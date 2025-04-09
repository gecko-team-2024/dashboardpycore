import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const RealTimeLogs: React.FC = () => {
  const [logs, setLogs] = useState<string>(() => {
    return localStorage.getItem("serverLogs") || "";
  });

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket("wss://pycore.onrender.com/ws/logs");

    socketRef.current.onmessage = (event) => {
      setLogs((prevLogs) => {
        const newLogs = prevLogs + event.data;
        localStorage.setItem("serverLogs", newLogs);
        return newLogs;
      });
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

  const handleClearLogs = () => {
    localStorage.removeItem("serverLogs");
    setLogs("");
  };

  const handleExportExcel = () => {
    const logLines = logs.split("\n").filter((line) => line.trim() !== "");
    const worksheetData = logLines.map((line, index) => ({ STT: index + 1, Log: line }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "server-logs.xlsx");
  };

  return (
    <div style={{ margin: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Real-Time Server Logs</h1>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10, gap: 10 }}>
        <button
          onClick={handleClearLogs}
          style={{
            padding: "6px 12px",
            borderRadius: 4,
            border: "1px solid #ccc",
            backgroundColor: "#f44336",
            color: "white",
            cursor: "pointer",
          }}
        >
          Xoá logs
        </button>

        <button
          onClick={handleExportExcel}
          style={{
            padding: "6px 12px",
            borderRadius: 4,
            border: "1px solid #ccc",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer",
          }}
        >
          Xuất Excel
        </button>
      </div>

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