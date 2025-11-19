"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AnimalCard from "@/components/AnimalCard";

interface AdminAnimal {
  _id: string;
  name: string;
  breed: string;
  hoursTrained: number;
  imageUrl: string;
}

export default function AdminAnimalsPage() {
  const { userId, admin } = useAuth();
  const router = useRouter();
  const [animals, setAnimals] = useState<AdminAnimal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!userId || !admin)) {
      router.push("/");
      return;
    }

    const fetchAnimals = async () => {
      try {
        const res = await fetch("/api/admin/animals");
        if (res.ok) setAnimals(await res.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchAnimals();
    else setLoading(false);
  }, [userId, admin, router, loading]);

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (!admin) return null;

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">All Animals</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {animals.map((animal) => (
          <AnimalCard
            key={animal._id}
            name={animal.name}
            breed={animal.breed}
            hoursTrained={animal.hoursTrained}
            imageUrl={animal.imageUrl}
            ownerName="Unknown"
          />
        ))}
      </div>
    </div>
  );
}
