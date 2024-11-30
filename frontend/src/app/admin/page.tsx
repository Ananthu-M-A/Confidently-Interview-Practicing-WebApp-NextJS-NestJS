"use client";

import WithAdminAuth from "@/components/auth-guards/WithAdminAuth";
import { Statistics } from "@/components/Statistics";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/contexts/auth/AdminAuthContext";
import { useRouter } from "next/navigation";
import React from "react";

const AdminHome = () => {
  const router = useRouter();
  const { stats } = useAdminAuth();

  return (
    <div className="px-4 py-6 sm:px-8">
      <h1 className="text-2xl font-bold mb-6 sm:text-4xl">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4 sm:text-xl">
            Platform Statistics
          </h2>
          <p className="text-sm sm:text-base">{`Total Users: ${stats.totalUsers}`}</p>
          <p className="text-sm sm:text-base">{`Total Experts: ${stats.totalExperts}`}</p>
          <p className="text-sm sm:text-base">{`Interviews Conducted: ${stats.totalInterviews}`}</p>
          <p className="text-sm sm:text-base">{`Average User Rating: ${stats.avgRating}`}</p>
        </div>
        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4 sm:text-xl">Quick Actions</h2>
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => router.push("/admin/users")}
              className="font-bold px-4 py-2"
            >
              Manage Users
            </Button>
            <Button
              onClick={() => router.push("/admin/experts")}
              variant={"outline"}
              className="font-bold px-4 py-2"
            >
              Manage Experts
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        <div className="border p-4 rounded-lg text-center">
          <h2 className="text-lg font-bold mb-2 sm:text-xl">Users Count</h2>
          <p className="text-xl font-bold sm:text-3xl">{`${stats.totalUsers}`}</p>
        </div>
        <div className="border p-4 rounded-lg text-center">
          <h2 className="text-lg font-bold mb-2 sm:text-xl">Total Interviews</h2>
          <p className="text-xl font-bold sm:text-3xl">{`${stats.totalInterviews}`}</p>
        </div>
        <div className="border p-4 rounded-lg text-center">
          <h2 className="text-lg font-bold mb-2 sm:text-xl">Total Revenue</h2>
          <p className="text-xl font-bold sm:text-3xl">{`₹${stats.totalRevanue}`}</p>
        </div>
      </div>
      <div className="border p-4 rounded-lg mt-6">
        <h2 className="text-lg font-bold mb-4 sm:text-xl">Growth in Visual</h2>
        <Statistics />
      </div>
    </div>
  );
};

export default WithAdminAuth(AdminHome);