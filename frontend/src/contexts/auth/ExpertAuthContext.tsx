"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import axiosClient from "@/lib/axiosClient";

interface Expert {
  userId: string;
  username: string;
}

interface ExpertContextType {
  expert: Expert | null;
  login: (email: string, password: string) => Promise<void>;
  expertLogout: () => Promise<void>;
}

const ExpertAuthContext = createContext<ExpertContextType | undefined>(
  undefined
);

export const ExpertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [expert, setExpert] = useState<Expert | null>(null);

  useEffect(() => {
    const checkExpertAuth = async () => {
      const token = localStorage.getItem("expert-token");
      if (token) {
        try {
          const response = await axiosClient.get(`/expert/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setExpert(response.data);
        } catch (error) {
          console.error("Authentication check failed:", error);
          localStorage.removeItem("expert-token");
        }
      }
    };
    checkExpertAuth();
  }, []);

  async function login(email: string, password: string) {
    try {
      const response = await axiosClient.post(`/expert/login`, {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("expert-token", token);
      setExpert(expert);
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

  async function expertLogout() {
    try {
      localStorage.removeItem("expert-token");
      setExpert(null);
      toast.success("Successfully Logged Out");
    } catch (error) {
      toast.warning("Unsuccessfully Logged Out");
      console.error("Unsuccessfully Logged Out:", error);
    }
  }

  return (
    <ExpertAuthContext.Provider
      value={{
        expert,
        login,
        expertLogout,
      }}
    >
      {children}
    </ExpertAuthContext.Provider>
  );
};

export const useExpertAuth = () => {
  const context = useContext(ExpertAuthContext);
  if (context === undefined) {
    throw new Error("useExpertAuth must be used within an AuthProvider");
  }
  return context;
};
