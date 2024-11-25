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
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});

export default function ResetPasswordForm() {
  const { resetPassword } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await resetPassword(data.email);
      console.log("Password reset link sent");
      router.push("/login");
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  return (
    <Card className="w-2/5 mx-auto px-4 py-2 my-10 rounded-xl border-2 shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              Reset Your Password
            </CardTitle>
            <h1 className="text-xs text-center">
              Enter your email to receive a password reset link
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
          </CardContent>
          <CardContent className="text-center">
            <Button type="submit" className="font-bold w-full">
              Send Password Reset Link
            </Button>
          </CardContent>
        </form>
      </Form>
      <CardContent className="text-center">
        <CardDescription>
          Remember your password ?
          <Link
            className="font-semibold hover:text-black hover:underline"
            href="/login"
          >
            Login
          </Link>
        </CardDescription>
      </CardContent>
    </Card>
  );
}
