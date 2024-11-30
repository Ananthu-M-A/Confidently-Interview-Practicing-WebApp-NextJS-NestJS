"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Stats } from "@/interfaces/stats.interface";

interface Admin {
  _id: string;
  adminname: string;
}

interface AdminContextType {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<void>;
  adminLogout: () => Promise<void>;
  stats: Stats;
}

const AdminAuthContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalExperts: 0,
    totalInterviews: 0,
    avgRating: 0,
    totalRevanue: 0,
  });

  useEffect(() => {
    const checkAdminAuth = async () => {
      const token = localStorage.getItem("admin-token");
      if (token) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/me`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setAdmin(response.data);
        } catch (error) {
          console.error("Authentication check failed:", error);
          localStorage.removeItem("admin-token");
        }
      }
    };
    checkAdminAuth();
  }, []);

  useEffect(() => {
    async function loadStatistics() {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/stats`
      );
      if (response) {
        setStats(response.data);
      }
    }
    loadStatistics();
  }, []);

  async function login(email: string, password: string) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/login`,
        {
          email,
          password,
        }
      );
      if (response.status === 201) {
        const { token, admin } = response.data;
        localStorage.setItem("admin-token", token);
        setAdmin(admin);
        toast.success("Successfully Logged In");
      } else {
        toast.warning("Unsuccessfull attempt to Login");
      }
    } catch (error) {
      toast.warning("Unsuccessfull attempt to Login");
      console.error("Unsuccessfull attempt to Login:", error);
      throw error;
    }
  }

  async function adminLogout() {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/logout`);
      localStorage.removeItem("admin-token");
      setAdmin(null);
      toast.success("Successfully Logged Out");
    } catch (error) {
      toast.warning("Successfully Logged Out");
      console.error("Successfully Logged Out:", error);
    }
  }

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        login,
        adminLogout,
        stats
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AuthProvider");
  }
  return context;
};
