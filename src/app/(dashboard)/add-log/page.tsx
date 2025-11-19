"use client";

import React, { useState, useEffect } from "react";
import InputComp from "@/components/input";
import ButtonComp from "@/components/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Animal {
  _id: string;
  name: string;
}

export default function AddLogPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await fetch("/api/animal");
        if (res.ok) {
          const data = await res.json();
          setAnimals(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchAnimals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!selectedAnimal) {
      setError("Please select an animal.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animalId: selectedAnimal,
          title,
          date,
          description,
          hours: Number(hours),
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed");
      }
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          New Training Log
        </h1>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Animal
            </label>
            <select
              value={selectedAnimal}
              onChange={(e) => setSelectedAnimal(e.target.value)}
              className="block w-full px-3 py-2 bg-white border-0 border-b-2 border-gray-300 focus:outline-none focus:border-red-600 text-lg text-gray-900"
              required
            >
              <option value="">Select an Animal...</option>
              {animals.map((animal) => (
                <option key={animal._id} value={animal._id}>
                  {animal.name}
                </option>
              ))}
            </select>
          </div>
          <InputComp
            id="title"
            label="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <InputComp
            id="date"
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <InputComp
            id="hours"
            label="Hours"
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
          <div className="mb-6">
            <textarea
              placeholder="Notes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-red-600 text-lg text-gray-900 resize-none"
              rows={3}
            />
          </div>
          <ButtonComp
            label={isLoading ? "Saving..." : "Create Log"}
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
