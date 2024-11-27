"use client";

import WithAuth from "@/components/auth-guards/WithAuth";
import { useAuth } from "@/contexts/auth/AuthContext";
import React from "react";

const UserHome = () => {
  const { user } = useAuth();
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12">
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 text-center">
          Hello {user?.username}, Welcome to Confidently
        </h1>
      </main>
    </>
  );
};

export default WithAuth(UserHome);
