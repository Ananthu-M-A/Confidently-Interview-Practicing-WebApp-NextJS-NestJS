"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Stats } from "@/interfaces/stats.interface";
import axiosClient from "@/lib/axiosClient";

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
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/me`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setAdmin(data);
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
      const { data } = await axiosClient.get(`/admin/stats`);
      setStats(data);
    }
    try {
      loadStatistics();
    } catch (error) {
      console.error(`Error Fetching Stats:-`, error);
    }
  }, []);

  async function login(email: string, password: string) {
    try {
      const { data } = await axiosClient.post(`/admin/login`, {
        email,
        password,
      });
      localStorage.setItem("admin-token", data.token);
      toast.success("Successfully Logged In");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.warning("Email or password entered is incorrect.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Unsuccessful attempt to Login:", error);
      throw error;
    }
  }

  async function adminLogout() {
    try {
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
        stats,
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
