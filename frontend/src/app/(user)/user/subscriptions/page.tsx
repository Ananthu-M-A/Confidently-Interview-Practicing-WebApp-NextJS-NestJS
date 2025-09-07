"use client";

import WithAuth from "@/components/auth-guards/WithAuth";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth/AuthContext";
import axiosClient from "@/lib/axiosClient";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";

const SubscriptionsPage = () => {
  const router = useRouter();
  const { user, subscription } = useAuth();

  async function handleMonthlyPayment() {
    try {
      const { data } = await axiosClient.get(
        `/stripe/subscription/${user?.userId}`,
        {
          params: {
            plan: JSON.stringify(`monthly`),
          },
        }
      );
      router.push(data.paymentUrl);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.message);
      } else {
        console.log(`Something went wrong`);
      }
    }
  }
  
  return (
    <div className="px-4 py-6 sm:px-8">
      <h1 className="text-xl font-bold mb-6 sm:text-2xl md:text-4xl">
        Subscription Plans
      </h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {!subscription && (
          <div className="card border p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2 sm:text-xl">Free</h2>
            <h2 className="text-lg font-bold mb-4 sm:text-xl">₹0</h2>
            <p className="px-5 font-medium text-sm sm:text-base">{`1 interview per week`}</p>
            <p className="px-5 font-medium text-sm sm:text-base">{`Basic feedback`}</p>
            <p className="px-5 font-medium text-sm sm:text-base">{`Access to community forums`}</p>
            <Button
              variant={"ghost"}
              className="font-bold px-4 py-2 w-full mt-10 bg-gray-500 hover:bg-gray-500 hover:cursor-not-allowed"
            >
              Current Plan
            </Button>
          </div>
        )}
        <div className="card border p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2 sm:text-xl">Pro</h2>
          <h2 className="text-lg font-bold mb-4 sm:text-xl">₹1499/month</h2>
          <p className="px-5 font-medium text-sm sm:text-base">{`Upto 4 interviews per day`}</p>
          <p className="px-5 font-medium text-sm sm:text-base">{`Detailed feedback and analysis`}</p>
          <p className="px-5 font-medium text-sm sm:text-base">{`Priority scheduling with top experts`}</p>
          <p className="px-5 font-medium text-sm sm:text-base">{`Unlimited access to interview recordings`}</p>
          <Button
            onClick={!subscription ? handleMonthlyPayment : () => {}}
            className={`btn-primary font-bold px-4 py-2 w-full mt-4 ${
              subscription
                ? "hover:cursor-not-allowed bg-gray-500 hover:bg-gray-500"
                : ""
            }`}
          >
            {subscription?`Current Plan`:`Upgrade to Pro`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithAuth(SubscriptionsPage);
