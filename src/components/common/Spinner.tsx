import React from "react";

const Spinner: React.FC = () => {
  return (
    <div style={spinnerWrapper}>
      <div style={spinner} />
    </div>
  );
};

const spinnerWrapper: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh", // full viewport height to center vertically
};

const spinner: React.CSSProperties = {
  width: 48,
  height: 48,
  border: "5px solid #ccc",
  borderTopColor: "#007bff", // blue color
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

// Add keyframes for spin animation globally (in your CSS or style tag)
const styleSheet = document.styleSheets[0];
const keyframes =
  `@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }`;

styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default Spinner;
