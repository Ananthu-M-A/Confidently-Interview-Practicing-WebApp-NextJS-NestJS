"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subjects } from "@/constants/subjects";
import { difficulties } from "@/constants/difficulties";
import axios from "axios";
import { toast } from "sonner";
import { Expert } from "@/interfaces/expert.interface";
import { Interview } from "@/interfaces/interview.interface";
import { useAuth } from "@/contexts/auth/AuthContext";

const FormSchema1 = z.object({
  subject: z.string(),
  date: z.string(),
});

const FormSchema2 = z.object({
  difficulty: z.string(),
  time: z.string(),
});

const FormSchema3 = z.object({
  slot: z.string(),
});

const Interviews = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const { user } = useAuth();

  const form1 = useForm<z.infer<typeof FormSchema1>>({
    resolver: zodResolver(FormSchema1),
    defaultValues: {
      subject: "",
      date: "",
    },
  });

  const form2 = useForm<z.infer<typeof FormSchema2>>({
    resolver: zodResolver(FormSchema2),
    defaultValues: {
      difficulty: "",
      time: "",
    },
  });

  const form3 = useForm<z.infer<typeof FormSchema3>>({
    resolver: zodResolver(FormSchema3),
    defaultValues: {
      slot: "",
    },
  });

  async function getInterviews(formData: z.infer<typeof FormSchema3>) {
    try {
      console.log(formData.slot, user?.userId);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/interviews`,
        {
          params: {
            slot: JSON.stringify(formData.slot),
            userId: JSON.stringify(user?.userId),
          },
        }
      );
      setInterviews(data);
    } catch (error) {
      console.error("Unsuccessful attempt to Login:", error);
      throw error;
    }
  }

  async function scheduleInterview(formData: z.infer<typeof FormSchema2>) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/interview`,
        formData
      );
      toast.success("New Interview Scheduled Successfully");
    } catch (error) {
      console.error("Unsuccessful attempt to Login:", error);
      throw error;
    }
  }

  async function getExperts(formData: z.infer<typeof FormSchema1>) {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/experts`,
        { params: { formData: JSON.stringify(formData) } }
      );
      setExperts(data);
    } catch (error) {
      console.error("Unsuccessful attempt to Login:", error);
      throw error;
    }
  }

  useEffect(() => {
    async function getDates() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/interview-dates/${user?.userId}`
        );
        console.log(user?.userId, response.data);
        setDates(response.data);
      } catch (error) {
        console.error("Error fetching interview dates:", error);
        toast.error("Failed to load  interview dates");
      }
    }

    getDates();
  }, [user?.userId]);

  return (
    <div className="px-4 py-6">
      <h1 className="text-lg md:text-xl font-bold mb-6">
        Schedule an Interview
      </h1>
      <div className="flex flex-col md:flex-row gap-4 md:gap-10">
        <div className="w-full md:w-1/2 border p-4 rounded-lg">
          <h2 className="text-base md:text-lg font-bold mb-2">
            Interview Details
          </h2>
          <Form {...form1}>
            <form
              onSubmit={form1.handleSubmit(getExperts)}
              className="space-y-6"
            >
              <FormField
                control={form1.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject for interview" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject, index) => (
                          <SelectItem key={index} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form1.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date and Time</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full font-bold px-4 py-2" type="submit">
                Find Available Experts
              </Button>
            </form>
          </Form>
          {experts.length !== 0 && (
            <>
              <h2 className="text-sm md:text-md font-medium mt-6 mb-2">
                Experts Available
              </h2>
              <Form {...form2}>
                <form
                  onSubmit={form2.handleSubmit(scheduleInterview)}
                  className="space-y-6"
                >
                  {experts.map((expert, index) => (
                    <React.Fragment key={index}>
                      <FormField
                        control={form2.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{expert.fullname}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a slot for interview" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {expert.availability.map((slot, index1) => (
                                  <SelectItem key={index1} value={slot}>
                                    {new Date(slot).toString()}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form2.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Difficulty Level</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a difficulty level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {difficulties.map((difficulty, index) => (
                                  <SelectItem key={index} value={difficulty.id}>
                                    {difficulty.level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </React.Fragment>
                  ))}
                  <Button className="w-full font-bold px-4 py-2" type="submit">
                    Schedule Interview
                  </Button>
                </form>
              </Form>
            </>
          )}
        </div>
        <div className="w-full md:w-1/2 border p-4 rounded-lg">
          <h2 className="text-base md:text-lg font-bold mb-2">
            Upcoming Interviews
          </h2>
          <Form {...form3}>
            <form
              onSubmit={form3.handleSubmit(getInterviews)}
              className="space-y-6"
            >
              <FormField
                control={form3.control}
                name="slot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select a Date</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a date" />
                      </SelectTrigger>
                      <SelectContent>
                        {dates.map((date, index) => (
                          <SelectItem key={index} value={date}>
                            {date}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <h2 className="text-sm md:text-md font-medium mt-6 mb-2">
                Interviews Scheduled
              </h2>
              <Button className="w-full font-bold px-4 py-2" type="submit">
                Cancel Scheduled Interviews
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Interviews;
