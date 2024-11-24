"use client";

import WithAuth from "@/components/WithAuth";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";

const UserHome = () => {
  const { user } = useAuth();
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">Hello {user?.username}, Welcome to Confidently</h1>
      </main>
    </>
  );
};

export default WithAuth(UserHome);
