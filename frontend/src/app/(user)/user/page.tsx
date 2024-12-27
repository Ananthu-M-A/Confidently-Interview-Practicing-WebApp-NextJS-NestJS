"use client";

import WithAuth from "@/components/auth-guards/WithAuth";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useRouter } from "next/navigation";
import React from "react";

const UserHome = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="px-4 py-6 sm:px-8">
      <h1 className="text-xl font-bold mb-6 sm:text-2xl md:text-4xl">
        {`Welcome Back, ${user?.username}`}
      </h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2 sm:text-xl">Your Stats</h2>
          <p className="text-sm sm:text-base">{`Average Score: ${user}`}</p>
          <p className="text-sm sm:text-base">{`Total Interviews: ${user}`}</p>
          <p className="text-sm sm:text-base">{`Strengths: ${user}`}</p>
          <p className="text-sm sm:text-base">{`Areas of Improvement: ${user}`}</p>
        </div>
        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4 sm:text-xl">Quick Actions</h2>
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => router.push("/user/interviews")}
              className="font-bold px-4 py-2"
            >
              Schedule New Interview
            </Button>
            <Button
              onClick={() => router.push("/user/profile")}
              variant={"outline"}
              className="font-bold px-4 py-2"
            >
              View Profile
            </Button>
          </div>
        </div>
      </div>
      <div className="border rounded-lg grid gap-6 mt-6 sm:grid-cols-1 md:grid-cols-3">
        <div className="p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2 sm:text-xl">
            Next Upcoming Interview
          </h2>
          <p className="text-sm sm:text-base">{`Subject: ${user}`}</p>
          <p className="text-sm sm:text-base">{`Date: ${user}`}</p>
          <p className="text-sm sm:text-base">{`Time: ${user}`}</p>
          <p className="text-sm sm:text-base">{`Expert: ${user}`}</p>
          <div className="flex flex-col gap-2 mt-4">
            <Button
              onClick={() => router.push("")}
              className="font-bold px-4 py-2"
            >
              Join Interview
            </Button>
            <Button
              variant={"outline"}
              onClick={() => router.push("/user/interviews")}
              className="font-bold px-4 py-2"
            >
              View All Upcoming Interviews
            </Button>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-bold mt-8 sm:text-xl">Recent Interviews</h2>
      <div className="border p-4 rounded-lg mt-5 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h2 className="text-md font-semibold">{`MERN Development`}</h2>
          <p className="text-sm sm:text-base">{`Date and Time`}</p>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <h2 className="text-md font-semibold">{`Score: a/b`}</h2>
          <Button
            variant={"outline"}
            onClick={() => router.push("")}
            className="text-sm sm:text-base px-4 py-2"
          >
            View Feedback
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithAuth(UserHome);
