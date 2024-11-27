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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { FaGoogle, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useRouter } from "next/navigation";

const FormSchema = z
  .object({
    fullname: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        {
          message:
            "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { register, registerGoogle, registerLinkedin, user } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await register(data.email, data.password, data.fullname);
      console.log("Registration Successfull");
      window.location.reload();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }

  const handleGoogleSignup = async () => {
    try {
      await registerGoogle();
      console.log("Registration Successfull");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleLinkedinSignup = async () => {
    try {
      await registerLinkedin();
      console.log("Registration Successfull");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  useEffect(() => {
    if (user) {
      router.push("/user");
    }
  }, [user, router]);

  return (
    <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto px-4 py-6 my-6 rounded-xl border-2 shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl text-center">
              Sign Up for Confidently
            </CardTitle>
            <h1 className="text-sm sm:text-xs text-center mt-1">
              Create your account to start improving your interview skills
            </h1>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold p-1">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg:- Ananthu M A"
                      {...field}
                      type="text"
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
                  <FormLabel className="text-sm font-semibold p-1">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg:- ananthu@gmail.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold p-1">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg:- P@55word"
                      {...field}
                      type={isChecked ? "text" : "password"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold p-1">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg:- P@55word"
                      {...field}
                      type={isChecked ? "text" : "password"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start p-1">
              <Label className="flex items-center text-sm sm:text-xs font-semibold mb-2 sm:mb-0">
                <Input
                  type="checkbox"
                  id="show-password"
                  className="w-4"
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                  aria-label="Show Password"
                />
                <span className="ml-2">Show Password</span>
              </Label>
              <Button type="submit" className="font-bold w-full sm:w-auto">
                Sign Up
              </Button>
            </div>
          </CardContent>
        </form>
      </Form>
      <h1 className="text-sm text-center mt-4">Or sign up with</h1>
      <CardContent className="flex gap-4 sm:gap-10 justify-center pt-3">
        <Button
          variant="outline"
          onClick={handleGoogleSignup}
          className="border border-black font-semibold flex items-center gap-2 px-4 py-2 text-sm"
        >
          <FaGoogle className="text-red-600" />
          Google
        </Button>
        <Button
          variant="outline"
          onClick={handleLinkedinSignup}
          className="border border-black font-semibold flex items-center gap-2 px-4 py-2 text-sm"
        >
          <FaLinkedinIn className="text-blue-600" />
          LinkedIn
        </Button>
      </CardContent>
      <CardContent className="text-center mt-4">
        <CardDescription>
          Already have an account?{" "}
          <Link
            className="font-semibold hover:text-black hover:underline"
            href="/login"
          >
            Login Now
          </Link>
        </CardDescription>
      </CardContent>
    </Card>
  );
}
