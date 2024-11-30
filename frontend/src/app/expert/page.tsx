"use client";

import WithExpertAuth from "@/components/auth-guards/WithExpertAuth";
import React from "react";

const ExpertHome = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-8 lg:px-24 py-12">
        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-6 sm:mb-8">
          Hello Expert, Welcome to Confidently
        </h1>
      </div>
    </>
  );
};

export default WithExpertAuth(ExpertHome);
