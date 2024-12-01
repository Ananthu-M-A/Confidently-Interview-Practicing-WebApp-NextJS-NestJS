"use client";

import WithAuth from "@/components/auth-guards/WithAuth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const UserSubscriptionPage = () => {
  const router = useRouter();

  return (
    <div className="px-4 py-6 sm:px-8">
      <h1 className="text-xl font-bold mb-6 sm:text-2xl md:text-4xl">
        Subscription Plans
      </h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2 sm:text-xl">Your Stats</h2>
          <p className="text-sm sm:text-base">{`Average Score`}</p>
          <p className="text-sm sm:text-base">{`Total Interviews`}</p>
          <p className="text-sm sm:text-base">{`Strengths`}</p>
          <p className="text-sm sm:text-base">{`Areas of Improvement`}</p>
        </div>
        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4 sm:text-xl">Quick Actions</h2>
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => router.push("")}
              className="font-bold px-4 py-2"
            >
              Schedule New Interview
            </Button>
            <Button
              onClick={() => router.push("")}
              variant={"outline"}
              className="font-bold px-4 py-2"
            >
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithAuth(UserSubscriptionPage);
