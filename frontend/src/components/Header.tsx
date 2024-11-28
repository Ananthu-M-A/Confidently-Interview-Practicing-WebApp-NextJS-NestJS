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
    <div className="p-4 sm:p-6 border-b border-gray-300 bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4 sm:mb-0">
          <Link href={"/"}>Confidently</Link>
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {(pathname === "/login" || pathname === "/register" || pathname === "/") && (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border border-gray-500 font-bold py-2 px-4 sm:py-3 sm:px-6"
                >
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full sm:w-auto font-bold py-2 px-4 sm:py-3 sm:px-6">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          {user && (
            <Button
              onClick={() => handleLogout("user")}
              className="w-full sm:w-auto font-bold py-2 px-4 sm:py-3 sm:px-6"
            >
              Log Out
            </Button>
          )}
          {expert && (
            <Button
              onClick={() => handleLogout("expert")}
              className="w-full sm:w-auto font-bold py-2 px-4 sm:py-3 sm:px-6"
            >
              Log Out
            </Button>
          )}
          {admin && (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link className="font-bold mt-2 sm:mt-0" href="/admin">
                Dashboard
              </Link>
              <Link className="font-bold mt-2 sm:mt-0" href="/admin/experts">
                Experts
              </Link>
              <Link className="font-bold mt-2 sm:mt-0" href="/admin/users">
                Users
              </Link>
              <Button
                onClick={() => handleLogout("admin")}
                className="w-full sm:w-auto font-bold py-2 px-4 sm:py-3 sm:px-6"
              >
                Log Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
