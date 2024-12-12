"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import axiosClient from "@/lib/axiosClient";

interface User {
  userId: string;
  username: string;
  active: string;
}

interface AuthContextType {
  user: User | null;
  subscription: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    fullname: string
  ) => Promise<void>;
  registerGoogle: () => Promise<void>;
  registerLinkedin: () => Promise<void>;
  loginOauth: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axiosClient.get(`/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Authentication check failed:", error);
          localStorage.removeItem("token");
        }
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if(user){
          const { data } = await axiosClient.get(`/user/current-plan/${user?.userId}`);
          setSubscription(data.subscription);
        }
        
      } catch (error) {
        console.error("Subscription check failed:", error);
      }
    };
    checkSubscription();
  }, [user]);

  async function login(email: string, password: string) {
    try {
      const response = await axiosClient.post(`/auth/login`, {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      toast.success("Successfully Logged In");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
          toast.warning("Email or password entered is incorrect.");
        } else if (status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      if (error instanceof Error) {
        console.error("Login attempt failed:", error.message);
        throw error;
      }
    }
  }

  async function loginOauth() {
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
      toast.success("Successfull Logged In");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.warning("Oauth authentication invalid.");
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

  async function logout() {
    try {
      localStorage.removeItem("token");
      setUser(null);
      toast.success("Successfully Logged Out");
    } catch (error) {
      toast.error("Unsuccessfully Logged Out");
      console.error("Unsuccessfully Logged Out:", error);
      throw error;
    }
  }

  async function register(email: string, password: string, fullname: string) {
    try {
      const response = await axiosClient.post(`/auth/register`, {
        email,
        password,
        fullname,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      toast.success("Registration Successfull");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.warning("Email already registered.");
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

  async function registerGoogle() {
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

  async function registerLinkedin() {
    try {
      const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
      const redirectUri = process.env.NEXT_PUBLIC_LINKEDIN_CALLBACK_URL;
      // const scope = 'r_liteprofile r_emailaddress';

      // Redirect to LinkedIn's OAuth authorization page
      window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=r_liteprofile%20r_emailaddress`;

      // const urlObj = new URL(window.location.href);
      // const token = urlObj.searchParams.get("token");
      // const user = urlObj.searchParams.get("user");

      // const userObject = JSON.parse(decodeURIComponent(user as string));
      // if (token && userObject) {
      toast.success("Registration Successfull");
      // }
    } catch (error) {
      toast.warning("Registration Unuccessfull");
      console.error("Registration Unuccessfull:", error);
      throw error;
    }
  }

  async function resetPassword(email: string) {
    try {
      await axiosClient.post(`/auth/reset-password`, { email });
      toast.success("Password reset link sent, Check your email.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          toast.warning("Email not registered");
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

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        login,
        logout,
        register,
        registerGoogle,
        registerLinkedin,
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
