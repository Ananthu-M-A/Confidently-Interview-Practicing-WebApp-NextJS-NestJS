"use client"

import { Button } from "@/components/ui/button";
import WithAuth from "@/components/WithAuth";
import { useAuth } from "@/contexts/AuthContext";

function Home() {
  const {user} = useAuth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Your App {user?.email}</h1>
      <Button>Get Started</Button>
    </main>
  );
}

export default WithAuth(Home)