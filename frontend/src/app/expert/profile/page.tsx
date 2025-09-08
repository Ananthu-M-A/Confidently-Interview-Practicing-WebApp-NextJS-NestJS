"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import WithExpertAuth from "@/components/auth-guards/WithExpertAuth";
import { useEffect } from "react";
import { useExpertAuth } from "@/contexts/auth/ExpertAuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subjects } from "@/constants/subjects";
import axiosClient from "@/lib/axiosClient";

const FormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email address" }),
  fullname: z.string().min(1, { message: "Name is required" }),
  specialization: z.string().min(1, { message: "Specialization is required" }),
  yearsOfExperience: z
    .string()
    .min(1, { message: "Years of experience is required" }),
});

function ViewExpert() {
  const router = useRouter();
  const { expert } = useExpertAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      fullname: "",
      specialization: "",
      yearsOfExperience: "",
    },
  });

  useEffect(() => {
    async function getExpertData() {
      try {
        const response = await axiosClient.get(
          `/expert/profile/${expert?.userId}`
        );
        if (response.data) {
          form.reset(response.data);
        }
      } catch (error) {
        console.error("Error fetching expert data:", error);
        toast.error("Failed to load profile data");
      }
    }

    getExpertData();
  }, [expert, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await axiosClient.put(
        `/expert/profile/${expert?.userId}`,
        data
      );
      if (response) {
        router.push("/expert");
        toast.success("Expert Profile Updated Successfully");
      } else {
        toast.warning("Expert Profile Updated Unsuccessfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Profile Updation Failed");
    }
  }

  return (
    <Card className="card w-full max-w-xl mx-auto p-4 sm:p-6 my-6 rounded-xl border shadow-lg">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl text-left font-semibold">
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg:- Ananthu M A"
                      {...field}
                      type="text"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg:- ananthu@gmail.com"
                      {...field}
                      type="email"
                      className="w-full"
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Specialization
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your specialization" />
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
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Years of Experience
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg:- 10"
                      {...field}
                      type="number"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardContent className="text-center mt-4">
            <Button
              type="submit"
              className="btn-primary w-full sm:w-auto px-4 py-2 font-bold"
            >
              Update Profile
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}

export default WithExpertAuth(ViewExpert);
