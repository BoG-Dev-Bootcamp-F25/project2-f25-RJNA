"use client";

import React, { useState } from "react";
import InputComp from "./input";
import ButtonComp from "./button";
import Link from "next/link";

const CreateAccountForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          confirmPassword,
          admin: isAdmin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      // Success
      alert("Account created successfully! Please log in.");
      window.location.href = "/login"; // Redirect to login page
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl text-center w-full max-w-md mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-gray-800">Create Account</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <InputComp
          id="fullName"
          label="Full Name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
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
        <InputComp
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* Admin Checkbox */}
        <div className="flex items-center justify-start text-left my-4">
          <input
            type="checkbox"
            id="admin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <label htmlFor="admin" className="ml-2 block text-sm text-gray-900">
            I am an Admin
          </label>
        </div>

        <ButtonComp
          label={isLoading ? "Creating..." : "Sign Up"}
          type="submit"
          disabled={isLoading}
        />
      </form>

      <p className="mt-8 text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-red-600 hover:underline font-medium"
        >
          Log in
        </Link>
      </p>
    </div>
  );
};

export default CreateAccountForm;
