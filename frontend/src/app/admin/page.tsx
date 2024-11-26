"use client";

import WithAdminAuth from "@/components/auth-guards/WithAdminAuth";
import React from "react";

const AdminHome = () => {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">
          Hello Admin, Welcome to Confidently
        </h1>
      </main>
    </>
  );
};

export default WithAdminAuth(AdminHome);
