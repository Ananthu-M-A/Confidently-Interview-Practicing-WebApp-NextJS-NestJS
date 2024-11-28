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
      <div className="p-4 sm:p-6 border-b border-black flex justify-between items-center">
        <h1 className="text-3xl font-semibold">
          <Link href={"/"}>Confidently</Link>
        </h1>
        <div className="flex gap-4">
          {(pathname === "/login" ||
            pathname === "/register" ||
            pathname === "/") && (
            <>
              <Button
                variant="outline"
                className="border border-black font-bold py-2 px-4 sm:py-3 sm:px-6"
              >
                <Link href={"/login"}>Log In</Link>
              </Button>
              <Button className="font-bold py-2 px-4 sm:py-3 sm:px-6">
                <Link href={"/register"}>Sign Up</Link>
              </Button>
            </>
          )}
          {user && (
            <Button
              onClick={() => handleLogout("user")}
              className="font-bold py-2 px-4 sm:py-3 sm:px-6"
            >
              Log Out
            </Button>
          )}
          {expert && (
            <Button
              onClick={() => handleLogout("expert")}
              className="font-bold py-2 px-4 sm:py-3 sm:px-6"
            >
              Log Out
            </Button>
          )}
          {admin && (
            <>
              <Link className="font-bold mt-2 mx-5" href={"/admin"}>
                Dashboard
              </Link>
              <Link className="font-bold mt-2 mx-5" href={"/admin/experts"}>
                Experts
              </Link>
              <Link className="font-bold mt-2 mx-5" href={"/admin/users"}>
                Users
              </Link>
              <Button
                onClick={() => handleLogout("admin")}
                className="font-bold py-2 px-4 sm:py-3 sm:px-6"
              >
                Log Out
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
