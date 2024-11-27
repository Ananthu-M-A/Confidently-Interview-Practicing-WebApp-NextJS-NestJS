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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useExpertAuth } from "@/contexts/auth/ExpertAuthContext";

const FormSchema = z.object({
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
});

export default function LoginPage() {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { login, expert } = useExpertAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await login(data.email, data.password);
      console.log("Expert logged in");
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  useEffect(() => {
    if (expert) {
      router.push("/expert");
    } else {
      setIsLoading(false);
    }
  }, [expert, router]);

  return (
    <>
      {!isLoading && (
        <Card className="w-full max-w-md mx-auto px-4 py-4 sm:py-6 my-4 rounded-xl border-2 shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <CardHeader>
                <CardTitle className="text-xl sm:text-3xl text-center">
                  Confidently Expert Login
                </CardTitle>
                <h1 className="text-xs sm:text-sm text-center mt-1">
                  Enter your credentials to access your account
                </h1>
              </CardHeader>
              <CardContent>
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
              </CardContent>
              <CardContent className="text-center">
                <div className="flex justify-between items-center p-1">
                  <Label className="flex items-center text-xs font-semibold">
                    <Input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={isChecked}
                      onChange={() => setIsChecked(!isChecked)}
                      aria-label="Show Password"
                    />
                    <span className="ml-2">Show Password</span>
                  </Label>
                  <Button type="submit" className="font-bold">
                    Log In
                  </Button>
                </div>
              </CardContent>
            </form>
          </Form>
          <CardContent className="text-center mt-4">
            <CardDescription>
              {`Forgot password? `}
              <Link
                className="font-semibold hover:text-black hover:underline"
                href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`}
              >
                Contact Admin
              </Link>
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </>
  );
}
