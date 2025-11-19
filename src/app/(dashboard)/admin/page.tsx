"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface AdminLog {
  _id: string;
  title: string;
  date: string;
  hours: number;
  user: string;
  animal: string;
}

export default function AdminTrainingPage() {
  const { userId, admin } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!userId || !admin)) {
      router.push("/");
      return;
    }

    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/admin/training");
        if (res.ok) setLogs(await res.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchLogs();
    else setLoading(false);
  }, [userId, admin, router, loading]);

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (!admin) return null;

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        All Training Logs
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No training logs found.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log._id}
              className="p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 flex justify-between items-center"
            >
              <div>
                <div className="font-medium text-gray-900">{log.title}</div>
                <div className="text-sm text-gray-500">
                  {new Date(log.date).toLocaleDateString()} • {log.hours} hours
                </div>
              </div>
              <div className="text-xs text-gray-400">ID: {log._id}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
