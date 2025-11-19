import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "Progress",
  description: "Animal Training App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen w-full bg-white text-gray-900 font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
