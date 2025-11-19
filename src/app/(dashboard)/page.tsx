"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import LogCard from "@/components/LogCard";

// Mock Data ensuring something shows up and for testing
const MOCK_LOGS = [
  {
    _id: "1",
    title: "Complete sit lessons",
    date: "2023-10-20",
    description:
      "Lucy finishes the sit lessons very well today. Should give her a treat.",
    hours: 20,
    animalId: "1",
    userId: "1",
  },
  {
    _id: "2",
    title: "Complete sit lessons",
    date: "2023-10-20",
    description:
      "Lucy finishes the sit lessons very well today. Should give her a treat.",
    hours: 20,
    animalId: "1",
    userId: "1",
  },
];

interface TrainingLog {
  _id: string;
  title: string;
  date: string;
  description: string;
  hours: number;
  animalId: string;
  userId: string;
}
interface Animal {
  _id: string;
  name: string;
  breed: string;
}

export default function DashboardPage() {
  const { userId } = useAuth();
  const [logs, setLogs] = useState<TrainingLog[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsRes, animalsRes] = await Promise.all([
          fetch("/api/training"),
          fetch("/api/animal"),
        ]);

        if (logsRes.ok) setLogs(await logsRes.json());
        else setLogs(MOCK_LOGS); // Fallback to mock data if API fails so you can see design

        if (animalsRes.ok) setAnimals(await animalsRes.json());
      } catch (error) {
        console.error(error);
        setLogs(MOCK_LOGS); // Fallback on error
      } finally {
        setLoading(false);
      }
    };

    // Force fetch even if not logged in
    fetchData();
  }, [userId]);

  const getAnimalName = (id: string) => {
    // Mock return for the mock data
    if (id === "1") return "Long Lam - Golden Retriever - Lucy";

    const animal = animals.find((a) => a._id === id);
    return animal ? `${animal.name} - ${animal.breed}` : "Unknown Animal";
  };

  return (
    <div className="w-full h-full p-8">
      {/* Header Row */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-700">Training logs</h1>

        <Link
          href="/add-log"
          className="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-[#C92A2A] transition-colors"
        >
          <div className="w-4 h-4 border border-gray-400 flex items-center justify-center text-gray-500 text-xs rounded-sm">
            +
          </div>
          Create new
        </Link>
      </div>

      {/* Divider Line */}
      <div className="w-full h-px bg-gray-200 mb-6"></div>

      {/* Content */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-gray-400 italic">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="text-gray-400 italic">No logs yet.</div>
        ) : (
          logs.map((log) => (
            <LogCard
              key={log._id}
              title={log.title}
              date={log.date}
              description={log.description}
              hours={log.hours}
              animalName={getAnimalName(log.animalId)}
              authorName="" // Name is built into the getAnimalName
            />
          ))
        )}
      </div>
    </div>
  );
}
