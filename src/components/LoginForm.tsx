"use client";

import React, { useState } from "react";
import InputComp from "@/components/input";
import ButtonComp from "@/components/button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to log in");
      }

      const data = await response.json();

      const isAdmin = data.admin === true;

      login(data.userId, data.fullName || "Trainer", isAdmin);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl text-center w-full max-w-md mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-gray-800">Login</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <InputComp
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputComp
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <ButtonComp
          label={isLoading ? "Logging in..." : "Log in"}
          type="submit"
          disabled={isLoading}
        />
      </form>
      <p className="mt-8 text-gray-600">
        Don't have an account?{" "}
        <Link
          href="/create-account"
          className="text-red-600 hover:underline font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
