import React from "react";
import CreateAccountForm from "@/components/CreateAccountForm";

export default function CreateAccountPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden">
      <header className="w-full p-6 bg-white shadow-sm z-10">
        <div className="max-w-7xl text-black text-5xl font-sans font-semibold flex flex-row items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
          Progress
        </div>
      </header>

      <main className="grow flex items-center justify-center p-4">
        <CreateAccountForm />
      </main>

      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-600 
                      rounded-full translate-x-[-50%] translate-y-[50%] 
                      lg:w-[600px] lg:h-[600px] lg:translate-x-[-50%] lg:translate-y-[50%] opacity-70"
      ></div>
    </div>
  );
}
