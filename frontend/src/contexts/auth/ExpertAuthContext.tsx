"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

interface Expert {
  _id: string;
  expertname: string;
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
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/expert/me`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log(response);
          
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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/expert/login`,
        {
          email,
          password,
        }
      );
      if (response.status === 201) {
        const { token, expert } = response.data;
        localStorage.setItem("expert-token", token);
        setExpert(expert);
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

  async function expertLogout() {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/expert/logout`);
      localStorage.removeItem("expert-token");
      setExpert(null);
      toast.success("Successfully Logged Out");
    } catch (error) {
      toast.warning("Successfully Logged Out");
      console.error("Successfully Logged Out:", error);
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
