import React from "react";

export const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
