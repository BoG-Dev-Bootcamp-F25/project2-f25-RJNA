import React from "react";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden">
      <header className="w-full p-6 bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto"></div>
      </header>

      <main className="grow flex items-center justify-center p-4">
        <LoginForm />
      </main>

      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-600 
            rounded-full translate-x-[-50%] translate-y-[50%] 
            lg:w-[600px] lg:h-[600px] lg:translate-x-[-50%] lg:translate-y-[50%] opacity-70"
      ></div>
    </div>
  );
}
