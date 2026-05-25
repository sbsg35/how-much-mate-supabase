"use client";
import React, { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import AuthProvider from "./AuthProvider";
import { QueryClientProviderWrapper } from "./QueryClientProvider";

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <QueryClientProviderWrapper>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProviderWrapper>
    </ThemeProvider>
  );
};

export default Providers;
