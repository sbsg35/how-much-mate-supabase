"use client";
import React, { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import AuthProvider from "./AuthProvider";

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
};

export default Providers;
