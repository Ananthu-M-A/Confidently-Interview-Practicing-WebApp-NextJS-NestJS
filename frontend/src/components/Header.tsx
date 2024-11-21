"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
      console.log("User logged out.");
      router.push("/login");
    } catch (error) {
      console.error("Logging out failed:", error);
    }
  }

  return (
    <>
      <div className="p-3 border-b border-black flex justify-between">
        <h1 className="text-3xl font-semibold">
          <Link href={"/"}>Confidently</Link>
        </h1>
        <div className="flex gap-4">
          {!user ? (
            <>
              <Button
                variant="outline"
                className="border border-black font-bold"
              >
                <Link href={"/login"}>Log In</Link>
              </Button>
              <Button className="font-bold">
                <Link href={"/register"}>Sign Up</Link>
              </Button>
            </>
          ) : (
            <Button onClick={handleLogout} className="font-bold">
              Log Out
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
