"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

interface User {
  _id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    fullname: string
  ) => Promise<void>;
  registerOauth: () => Promise<void>;
  loginOauth: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUser(response.data);
        } catch (error) {
          console.error("Authentication check failed:", error);
          localStorage.removeItem("token");
        }
      }
    };
    checkAuth();
  }, []);

  async function login(email: string, password: string) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      if (response.status === 201) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        setUser(user);
        toast.success("Successfull Logged In");
      } else {
        toast.warning("Unsuccessfull attempt to Login");
      }
    } catch (error) {
      toast.warning("Unsuccessfull attempt to Login");
      console.error("Unsuccessfull attempt to Login:", error);
      throw error;
    }
  }

  async function loginOauth() {
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
      toast.success("Successfull Logged In");
    } catch (error) {
      toast.warning("Unsuccessfull attempt to Login");
      console.error("Unsuccessfull attempt to Login:", error);
      throw error;
    }
  }

  async function logout() {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`);
      localStorage.removeItem("token");
      setUser(null);
      toast.success("Successfully Logged Out");
    } catch (error) {
      toast.warning("Successfully Logged Out");
      console.error("Successfully Logged Out:", error);
    }
  }

  async function register(email: string, password: string, fullname: string) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        { email, password, fullname }
      );
      if (response.status === 201) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        setUser(user);
        toast.success("Registration Successfull");
      } else {
        toast.warning("Registration Unsuccessfull");
      }
    } catch (error) {
      toast.warning("Registration Unsuccessfull");
      console.error("Registration Unsuccessfull:", error);
      throw error;
    }
  }

  async function registerOauth() {
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
      const urlObj = new URL(window.location.href);
      const token = urlObj.searchParams.get("token");
      const user = urlObj.searchParams.get("user");

      const userObject = JSON.parse(decodeURIComponent(user as string));
      if (token && userObject) {
        toast.success("Registration Successfull");
      }
    } catch (error) {
      toast.warning("Registration Unuccessfull");
      console.error("Registration Unuccessfull:", error);
      throw error;
    }
  }

  async function resetPassword(email: string) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/resetPassword`,
        { email }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        registerOauth,
        loginOauth,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
