import React from "react";

export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a1931",
        flexDirection: "column",
      }}>
      <div style={{ marginBottom: 24 }}>
        <svg width="60" height="60" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#7ecfff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="31.4 31.4"
            strokeDashoffset="0">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
      <div style={{ color: "#7ecfff", fontSize: "1.5rem", fontWeight: 600 }}>
        در حال بارگذاری...
      </div>
    </div>
  );
}
