"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name: string;
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
          console.log(token);

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
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  async function logout() {
    localStorage.removeItem("token");
    setUser(null);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`);
    } catch (error) {
      console.error("Logout failed:", error);
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
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  async function registerOauth() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`
      );
      console.log(response.data); //cors error
      if (response.status === 201) {
        // const { token, user } = response.data;
        // localStorage.setItem("token", token);
        // setUser(user);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, registerOauth }}
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
