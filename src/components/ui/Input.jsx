import React from "react";

export const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full rounded-md border border-border bg-input px-3 py-2 text-sm placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
