"use client";

import WithAuth from "@/components/auth-guards/WithAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Interview } from "@/interfaces/interview.interface";
import axiosClient from "@/lib/axiosClient";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const UserHome = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [latestInterview, setLatestInterview] = useState<Interview>();

  useEffect(() => {
    async function loadLatestInterview() {
      try {
        if (user) {
          const { data } = await axiosClient.get(
            `/user/latest-interview/${user.userId}`
          );
          setLatestInterview(data);
        }
      } catch (error) {
        console.error("Unsuccessful attempt to load latest interview:", error);
        throw error;
      }
    }
    loadLatestInterview();
  }, [user]);

  return (
    <div className="px-4 py-6 sm:px-8">
      <h1 className="text-xl font-bold mb-6 sm:text-2xl md:text-4xl">
        {`Welcome Back, ${user?.username}`}
      </h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        <Card className="card border p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2 sm:text-xl">Your Stats</h2>
          <p className="text-sm sm:text-base">{`Average Score: ${user}`}</p>
          <p className="text-sm sm:text-base">{`Total Interviews: ${user}`}</p>
          <p className="text-sm sm:text-base">{`Strengths: ${user}`}</p>
          <p className="text-sm sm:text-base">{`Areas of Improvement: ${user}`}</p>
        </Card>
        <Card className="card border p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4 sm:text-xl">Quick Actions</h2>
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => router.push("/user/interviews")}
              className="btn-primary font-bold px-4 py-2"
            >
              Schedule New Interview
            </Button>
            <Button
              onClick={() => router.push("/user/profile")}
              variant={"outline"}
              className="btn-primary font-bold px-4 py-2"
            >
              View Profile
            </Button>
          </div>
        </Card>
      </div>
      {latestInterview && (
        <Card className="card border rounded-lg grid gap-6 mt-6 sm:grid-cols-1 md:grid-cols-3">
          <div className="p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2 sm:text-xl">
              Next Upcoming Interview
            </h2>
            <p className="text-sm sm:text-base">{`Subject: ${latestInterview.subject}`}</p>
            <p className="text-sm sm:text-base">{`Date: ${latestInterview.date}`}</p>
            <p className="text-sm sm:text-base">{`Time: ${latestInterview.time}`}</p>
            <p className="text-sm sm:text-base">{`Expert: ${latestInterview.expertName}`}</p>
            <div className="flex flex-col gap-2 mt-4">
              {/* {latestInterview.status === "active" && ( */}
              <Button
                className="btn-primary font-bold px-4 py-2"
                onClick={() =>
                  router.push(`/user/live-interview/${latestInterview.id}`)
                }
              >
                Join Interview
              </Button>
              {/* )} */}
              <Button
                variant={"outline"}
                onClick={() => router.push("/user/interviews")}
                className="btn-primary font-bold px-4 py-2"
              >
                View All Upcoming Interviews
              </Button>
            </div>
          </div>
        </Card>
      )}
      <h2 className="text-lg font-bold mt-8 sm:text-xl">Recent Interviews</h2>
      <div className="card border p-4 rounded-lg mt-5 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h2 className="text-md font-semibold">{`MERN Development`}</h2>
          <p className="text-sm sm:text-base">{`Date and Time`}</p>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <h2 className="text-md font-semibold">{`Score: a/b`}</h2>
          <Button
            variant={"outline"}
            onClick={() => router.push("")}
            className="btn-primary text-sm sm:text-base px-4 py-2"
          >
            View Feedback
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithAuth(UserHome);
