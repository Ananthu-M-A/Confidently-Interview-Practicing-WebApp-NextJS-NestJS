"use client";

import React from "react";
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
import { Label } from "@/components/ui/label";
import { subjects } from "@/constants/subjects";
import { difficulties } from "@/constants/difficulties";
import axios from "axios";
import { toast } from "sonner";

const FormSchema = z.object({
  subject: z.string(),
  difficulty: z.string(),
  date: z.string(),
});

const Interviews = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subject: "",
      difficulty: "",
      date: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/list-experts`,
        { params: { formData: JSON.stringify(formData) } }
      );
      console.log(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.warning("Email or password entered is incorrect.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Unsuccessful attempt to Login:", error);
      throw error;
    }
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold mb-6">Schedule an Interview</h1>
      <div className="flex gap-10">
        <div className="w-1/2 border p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Interview Details</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
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
                control={form.control}
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
                          <SelectValue placeholder="Select a difficulty level for interview" />
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
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date and Time</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="shadcn"
                        type="datetime-local"
                        {...field}
                      />
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

          <h2 className="text-md font-medium mt-6 mb-2">Experts Available</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expert Name</FormLabel>
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
                        {["slot1", "slot2"].map((slot, index) => (
                          <SelectItem key={index} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant={"outline"}
                className="w-full font-bold px-4 py-2"
                type="submit"
              >
                Schedule Interview
              </Button>
            </form>
          </Form>
        </div>
        <div className="w-1/2 border p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Upcoming Interviews</h2>
          <Label>
            Select a Date
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a slot for interview" />
              </SelectTrigger>
              <SelectContent>
                {["slot1", "slot2"].map((slot, index) => (
                  <SelectItem key={index} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Label>
          <h2 className="text-md font-medium mt-6 mb-2">
            Interviews Scheduled
          </h2>
          <Button className="w-full font-bold px-4 py-2">
            Cancel Scheduled Interviews
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Interviews;
