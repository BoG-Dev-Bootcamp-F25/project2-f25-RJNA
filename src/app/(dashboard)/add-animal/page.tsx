"use client";

import React, { useState } from "react";
import InputComp from "@/components/input";
import ButtonComp from "@/components/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AddAnimalPage() {
  const { userId } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!userId) {
      setError("You must be logged in.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/animal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, breed, imageUrl }),
      });

      if (!response.ok) throw new Error("Failed to add animal");
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Error creating animal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Add New Animal
        </h1>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <InputComp
            id="name"
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputComp
            id="breed"
            label="Breed"
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
          />
          <InputComp
            id="imageUrl"
            label="Image URL"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <ButtonComp
            label={isLoading ? "Adding..." : "Add Animal"}
            type="submit"
            disabled={isLoading}
          />
        </form>
        <button
          onClick={() => router.back()}
          className="w-full mt-4 text-gray-500 text-sm hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
