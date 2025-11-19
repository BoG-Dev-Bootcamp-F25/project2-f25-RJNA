"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import AnimalCard from "@/components/AnimalCard";

interface Animal {
  _id: string;
  name: string;
  breed: string;
  hoursTrained: number;
  imageUrl: string;
  userId: string;
}

export default function AnimalsPage() {
  const { userId } = useAuth();

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await fetch("/api/animal");
        if (res.ok) {
          const data = await res.json();
          setAnimals(data);
        }
      } catch (error) {
        console.error("Error fetching animals:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchAnimals();
    else setLoading(false);
  }, [userId]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Page Title & Create Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Animals</h2>

          <Link
            href="/add-animal"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          >
            <div className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center bg-white text-gray-500">
              +
            </div>
            Create new
          </Link>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading animals...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animals.map((animal) => (
              <AnimalCard
                key={animal._id}
                name={animal.name}
                breed={animal.breed}
                hoursTrained={animal.hoursTrained}
                imageUrl={animal.imageUrl}
                ownerName="You" // Since this is the user's own animal list
              />
            ))}
            {animals.length === 0 && (
              <div className="col-span-full text-center py-10 bg-white rounded-lg border border-dashed border-gray-300 text-gray-500">
                No animals found. Add one to get started!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
