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
import { toast } from "sonner";
import { Interview } from "@/interfaces/interview.interface";
import { useAuth } from "@/contexts/auth/AuthContext";
import axiosClient from "@/lib/axiosClient";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import WithAuth from "@/components/auth-guards/WithAuth";

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

const FormSchema4 = z.object({
  interviewId: z.string(),
});

const Interviews = () => {
  const [experts, setExperts] = useState<
    {
      fullname: string;
      id: string;
      availableSlots: Date[];
    }[]
  >([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

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

  const form4 = useForm<z.infer<typeof FormSchema4>>({
    resolver: zodResolver(FormSchema4),
    defaultValues: {},
  });

  async function getInterviews(formData: z.infer<typeof FormSchema3>) {
    try {
      if (user) {
        const { data } = await axiosClient.get(
          `/user/interviews/${user.userId}`,
          {
            params: {
              slot: JSON.stringify(formData.slot),
            },
          }
        );
        setInterviews(data);
      }
    } catch (error) {
      console.error("Unsuccessful attempt to Login:", error);
      throw error;
    }
  }

  async function cancelInterviews(formData: z.infer<typeof FormSchema4>) {
    try {
      await axiosClient.patch(`/user/interview/${formData.interviewId}/cancel`);
      toast.success("Interview Cancelled Successfully");
      setInterviews((prev) =>
        prev.filter((interview) => interview.id !== formData.interviewId)
      );
    } catch (error) {
      console.error("Unsuccessful attempt cancel interview:", error);
      throw error;
    }
  }

  async function scheduleInterview(formData: z.infer<typeof FormSchema2>) {
    try {
      if (user) {
        await axiosClient.post(`/user/interview/${user.userId}`, formData, {
          params: {
            expertId: selectedExpert,
          },
        });
      }
      router.push("/user");
      toast.success("New Interview Scheduled Successfully");
    } catch (error) {
      console.error("Unsuccessful attempt to Login:", error);
      throw error;
    }
  }

  async function getExperts(formData: z.infer<typeof FormSchema1>) {
    try {
      if (formData.date === "" || formData.subject === "") {
        toast.warning("Select Interview Details And Try Again.");
      } else {
        const { data } = await axiosClient.get(`/user/experts`, {
          params: { formData: JSON.stringify(formData) },
        });
        if (data.length === 0) {
          toast.warning(
            "No Experts Found, Change Interview Details & Try Again"
          );
        } else {
          setExperts(data);
        }
      }
    } catch (error) {
      console.error("Unsuccessful attempt to Login:", error);
      throw error;
    }
  }

  useEffect(() => {
    async function getDates() {
      try {
        if (user) {
          const response = await axiosClient.get(
            `/user/interview-dates/${user.userId}`
          );
          setDates(response.data);
        }
      } catch (error) {
        console.error("Error fetching interview dates:", error);
        toast.error("Failed to load interview dates");
      }
    }

    getDates();
  }, [user]);

  return (
    <div className="px-4 py-6">
      <h1 className="text-lg md:text-xl font-bold mb-6">
        Schedule an Interview
      </h1>
      <div className="flex flex-col md:flex-row gap-4 md:gap-10">
        <div className="card w-full md:w-1/2 border p-4 rounded-lg">
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
                      <SelectContent className="border-0">
                        {subjects.map((subject, index) => (
                          <SelectItem
                            key={index}
                            value={subject.id}
                            className="btn-primary"
                          >
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
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={new Date(
                          new Date().setDate(new Date().getDate() + 1)
                        )
                          .toISOString()
                          .slice(0, 10)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="btn-primary w-full font-bold px-4 py-2"
                type="submit"
              >
                Find Available Experts
              </Button>
            </form>
          </Form>
          {experts.length !== 0 ? (
            <>
              <h2 className="text-sm md:text-md font-medium mt-6 mb-2">
                Experts Available
              </h2>
              <div className="max-h-48 overflow-y-auto border p-2 rounded-md">
                {experts.map((expert) => (
                  <div key={expert.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={expert.id}
                      name="expert"
                      value={expert.id}
                      checked={selectedExpert === expert.id}
                      onChange={(e) => setSelectedExpert(e.target.value)}
                      className="form-radio"
                    />
                    <label htmlFor={expert.id}>{expert.fullname}</label>
                  </div>
                ))}
              </div>
              {selectedExpert && (
                <Form {...form2}>
                  <form
                    onSubmit={form2.handleSubmit(scheduleInterview)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form2.control}
                      name="time"
                      render={({ field }) => {
                        const expert = experts.find(
                          (e) => e.id === selectedExpert
                        );
                        return (
                          <FormItem>
                            <FormLabel>Select a time slot</FormLabel>
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
                                {expert?.availableSlots.map((slot, index) => (
                                  <SelectItem
                                    key={index}
                                    value={new Date(slot).toISOString()}
                                  >
                                    {new Date(slot).toLocaleString()}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
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
                    <Button
                      className="w-full font-bold px-4 py-2"
                      type="submit"
                    >
                      Schedule Interview
                    </Button>
                  </form>
                </Form>
              )}
            </>
          ) : (
            <h2 className="text-sm md:text-md font-medium mt-6 mb-2 text-center">
              No Experts Found, Change Interview Details & Try Again!
            </h2>
          )}
        </div>
        <div className="card w-full md:w-1/2 border p-4 rounded-lg">
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
                      disabled={dates.length === 0}
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
              <Button
                disabled={dates.length === 0}
                className="btn-primary w-full font-bold px-4 py-2"
                type="submit"
              >
                View Interviews
              </Button>
            </form>
          </Form>
          {interviews.length !== 0 ? (
            <div className="mt-5">
              <Form {...form4}>
                <form
                  onSubmit={form4.handleSubmit(cancelInterviews)}
                  className="w-full space-y-6"
                >
                  <FormField
                    control={form4.control}
                    name="interviewId"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Interviews Scheduled</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {interviews.map((interview, index) => (
                              <FormItem
                                key={index}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <RadioGroupItem value={interview.id} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {new Date(interview.time).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full font-bold px-4 py-2" type="submit">
                    Cancel Scheduled Interviews
                  </Button>
                </form>
              </Form>
            </div>
          ) : (
            <h2 className="text-sm md:text-md font-medium mt-6 mb-2 text-center">
              No Interviews Found, Change Date & Try Again!
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithAuth(Interviews);
