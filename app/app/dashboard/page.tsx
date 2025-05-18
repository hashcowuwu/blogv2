"use client";
import React, { useState, useEffect } from "react";

interface DashboardData {
  message: string;
  userId: number;
  userName: string;
}

function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:4000/dashboard",{  credentials: 'include'}); // 浏览器会自动发送 authToken Cookie
          

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch dashboard data");
        } else {
          const data: DashboardData = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96">
        <div className="text-center text-2xl font-semibold text-gray-800 mb-6">
          Dashboard
        </div>
        {dashboardData && (
          <div className="mb-4">
            <p>Welcome, {dashboardData.userName}!</p>
            <p>User ID: {dashboardData.userId}</p>
            <p>{dashboardData.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;