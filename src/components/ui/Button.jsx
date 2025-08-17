import React from "react";

export const Button = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 hover:cursor-pointer";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2",
    ghost: "bg-transparent hover:bg-muted px-3 py-1",
    destructive: "bg-destructive text-white hover:bg-destructive/90 px-4 py-2",
  };
  return (
    <button
      className={`${base} ${
        variants[variant] ?? variants.default
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
