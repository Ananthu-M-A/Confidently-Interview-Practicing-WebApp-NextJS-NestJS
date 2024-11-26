"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/auth/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useExpertAuth } from "@/contexts/auth/ExpertAuthContext";
import { useAdminAuth } from "@/contexts/auth/AdminAuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { expert, expertLogout } = useExpertAuth();
  const { admin, adminLogout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout(userType: string) {
    try {
      const response =
        userType === "user"
          ? await logout()
          : userType === "expert"
          ? await expertLogout()
          : userType === "admin"
          ? await adminLogout()
          : "";
      console.log("User logged out.", response);
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
          {(pathname === "/login" || pathname === "/register") && (
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
          )}
          {user ? (
            <Button onClick={() => handleLogout("user")} className="font-bold">
              Log Out
            </Button>
          ) : expert ? (
            <Button
              onClick={() => handleLogout("expert")}
              className="font-bold"
            >
              Log Out
            </Button>
          ) : admin ? (
            <Button onClick={() => handleLogout("admin")} className="font-bold">
              Log Out
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
