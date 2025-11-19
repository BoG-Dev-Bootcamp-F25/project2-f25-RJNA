"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  admin: boolean;
}

export default function AdminUsersPage() {
  const { userId, admin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!userId || !admin)) {
      router.push("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) setUsers(await res.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUsers();
    else setLoading(false);
  }, [userId, admin, router, loading]);

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (!admin) return null;

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">All Users</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {user.admin ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Admin
                    </span>
                  ) : (
                    <span className="text-gray-500">User</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
