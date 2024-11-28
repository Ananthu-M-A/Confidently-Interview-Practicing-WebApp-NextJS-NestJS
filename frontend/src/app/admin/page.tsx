"use client";

import WithAdminAuth from "@/components/auth-guards/WithAdminAuth";
import React from "react";

const AdminHome = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 bg-gray-50">
        <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
          Hello Admin, Welcome to Admin Dashboard
        </h1>
      </div>
    </>
  );
};

export default WithAdminAuth(AdminHome);
