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
    <header className="w-full py-4 px-6 bg-gradient-to-r from-blue-100 via-indigo-100 to-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gradient bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent tracking-wide mb-4 sm:mb-0">
          Confidently Interview
        </h1>
        <nav className="flex flex-col sm:flex-row items-center gap-4">
          {(pathname === "/login" || pathname === "/register" || pathname === "/") && (
            <>
              <Link href="/login">
                <Button variant="outline" className="btn-primary w-full sm:w-auto">Log In</Button>
              </Link>
              <Link href="/register">
                <Button className="btn-primary w-full sm:w-auto">Sign Up</Button>
              </Link>
            </>
          )}
          {user && (
            <>
              <Link className="btn-primary" href="/user">Home</Link>
              <Link className="btn-primary" href="/user/profile">Profile</Link>
              <Link className="btn-primary" href="/user/subscriptions">Subscription</Link>
              <Button onClick={() => handleLogout("user")} className="btn-primary">Log Out</Button>
            </>
          )}
          {expert && (
            <>
              <Link className="btn-primary" href="/expert">Dashboard</Link>
              <Link className="btn-primary" href="/expert/profile">Profile</Link>
              <Button onClick={() => handleLogout("expert")} className="btn-primary">Log Out</Button>
            </>
          )}
          {admin && (
            <>
              <Link className="btn-primary" href="/admin">Dashboard</Link>
              <Link className="btn-primary" href="/admin/experts">Experts</Link>
              <Link className="btn-primary" href="/admin/users">Users</Link>
              <Button onClick={() => handleLogout("admin")} className="btn-primary">Log Out</Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
