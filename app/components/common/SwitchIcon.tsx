import React from "react";

export function SwitchIcon({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: "36px",
        height: "20px",
        borderRadius: "20px",
        backgroundColor: checked ? "#05136eff" : "#969494ff",
        position: "relative",
        cursor: "pointer",
        transition: "background-color 0.18s ease",
      }}
    >
      <div
        style={{
          width: "16px",
          height: "16px",
          backgroundColor: "#fff",
          borderRadius: "50%",
          position: "absolute",
          top: "2px",
          left: checked ? "18px" : "2px",
          transition: "left 0.18s ease",
          boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
        }}
      />
    </div>
  );
}