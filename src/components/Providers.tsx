"use client";

import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "text-sm",
          style: {
            background: "#0f172a",
            color: "#f1f5f9",
            border: "1px solid #334155",
          },
          success: { iconTheme: { primary: "#8b5cf6", secondary: "#fff" } },
        }}
      />
    </>
  );
}
