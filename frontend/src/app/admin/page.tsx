"use client";

import WithAdminAuth from "@/components/auth-guards/WithAdminAuth";
import React from "react";

const AdminHome = () => {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12">
        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-4 sm:mb-8">
          Hello Admin, Welcome to Confidently
        </h1>
      </main>
    </>
  );
};

export default WithAdminAuth(AdminHome);
