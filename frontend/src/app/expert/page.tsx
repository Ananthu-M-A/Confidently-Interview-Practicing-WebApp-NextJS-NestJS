"use client";

import WithExpertAuth from "@/components/auth-guards/WithExpertAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExpertAuth } from "@/contexts/auth/ExpertAuthContext";
import axiosClient from "@/lib/axiosClient";
import { isAxiosError } from "axios";
import React, { useState } from "react";
import { toast } from "sonner";

const ExpertHome = () => {
  const { expert } = useExpertAuth();
  const [slot, setSlot] = useState<string>("");

  async function updateAvailability() {
    try {
      console.log(slot);

      await axiosClient.patch(`/expert/availability/${expert?.userId}`, {
        availability: slot,
      });
      toast.success("New Slot Added Successfully");
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.warning("You've already booked this slot");
        } else {
          toast.error("Something went wrong, Try again.");
        }
      } else {
        console.error(error);
        toast.error("Something went wrong, Try again.");
      }
    }
  }

  return (
    <div className="px-4 py-6 sm:px-8">
      <h1 className="text-xl font-bold mb-6 sm:text-2xl md:text-4xl">
        Expert Dashboard
      </h1>
      <div>
        <h2 className="text-lg font-bold mb-4 sm:text-xl">
          Upcoming Interviews
        </h2>
        <div
          className="flex gap-4 overflow-x-auto scrollbar-hide"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {[1, 2, 3, 4, 5].map((interview, index) => (
            <div
              key={index}
              className="min-w-[250px] flex-shrink-0 border p-4 rounded-lg border-black mb-2"
            >
              <p className="text-sm sm:text-base">{`Date: ${expert}`}</p>
              <p className="text-sm sm:text-base">{`Subject: ${expert}`}</p>
              <p className="text-sm sm:text-base">{`Time: ${expert}`}</p>
              <Button className="font-bold px-4 py-2 mt-2">Join Now</Button>
              <Button variant={"outline"} className="font-bold px-4 py-2 mt-2">
                Cancel
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="border rounded-lg mt-6">
        <div className="p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2 sm:text-xl">
            Manage Availability
          </h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-5 mt-4">
            <Input
              type="datetime-local"
              min={new Date(new Date().setDate(new Date().getDate() + 1))
                .toISOString()
                .slice(0, 16)}
              onChange={(e) => {
                setSlot(e.target.value);
              }}
              className="sm:w-min"
            />
            <Button
              onClick={updateAvailability}
              className="font-bold px-4 py-2"
            >
              Add Slot
            </Button>
          </div>
          <h1 className="mt-4 sm:mt-1">
            Each slot is of 1 hour; select starting time to add slot.
          </h1>
        </div>
      </div>
      <div className="border p-4 rounded-lg mt-6">
        <h2 className="text-lg font-bold mb-2 sm:text-xl">Performance Stats</h2>
        <p className="text-sm sm:text-base">{`Total Interviews Conducted: ${expert}`}</p>
        <p className="text-sm sm:text-base">{`Average Rating: ${expert}`}</p>
        <p className="text-sm sm:text-base">{`Specializations: ${expert}`}</p>
      </div>
    </div>
  );
};

export default WithExpertAuth(ExpertHome);
