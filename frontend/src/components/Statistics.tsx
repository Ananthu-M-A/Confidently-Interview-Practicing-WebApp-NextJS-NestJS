"use client";

import { FaCheckCircle, FaStar, FaUsers, FaUserTie } from "react-icons/fa";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

export function Statistics() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  const stats = [
    {
      label: "Interviews Conducted",
      value: data?.interviews ?? 0,
      icon: <FaUserTie className="text-3xl" />,
    },
    {
      label: "Experts Available",
      value: data?.experts ?? 0,
      icon: <FaUsers className="text-3xl" />,
    },
    {
      label: "Success Stories",
      value: data?.stories ?? 0,
      icon: <FaStar className="text-3xl" />,
    },
    {
      label: "Active Users",
      value: data?.users ?? 0,
      icon: <FaCheckCircle className="text-3xl" />,
    },
  ];

  return (
    <section className="w-full py-10 flex flex-wrap justify-center gap-8">
      {isLoading && (
        <div className="w-full text-center text-lg animate-pulse text-blue-500">
          Loading statistics...
        </div>
      )}
      {isError && (
        <div className="w-full text-center text-lg text-red-500">
          Failed to load statistics.
        </div>
      )}
      {!isLoading &&
        !isError &&
        stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            className="card flex flex-col items-center w-56"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
          >
            {stat.icon}
            <span className="text-4xl font-extrabold mt-2">
              {stat.value}
            </span>
            <span className="text-lg mt-1 font-medium">
              {stat.label}
            </span>
          </motion.div>
        ))}
    </section>
  );
}
