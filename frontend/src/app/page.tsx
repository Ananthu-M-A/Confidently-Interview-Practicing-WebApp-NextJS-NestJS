"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { expertsOpinion } from "@/constants/opinions";
import { Button } from "@/components/ui/button";
import { features } from "@/constants/features";
import { successStories } from "@/constants/stories";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = () => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
        key="homepage"
      >
        <section className="text-center my-6 px-4 sm:px-8">
          <motion.h1
            className="text-3xl sm:text-4xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Master Your Interview Skills With Confidently
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl font-medium mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Practice real-time interviews with professional experts and boost
            your confidence.
          </motion.p>
          <Link href="/register">
            <Button className="btn-primary w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
        </section>
        <section className="px-5 sm:px-12 py-6">
          <h2 className="text-2xl sm:text-3xl font-medium text-left pb-4">
            Why Interview Skills Matter
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <h3 className="text-xl sm:text-2xl font-bold">
                  {feature.title}
                </h3>
                <p className="text-lg sm:text-xl font-medium">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
        <section className="px-5 sm:px-12 py-6">
          <h2 className="text-2xl sm:text-3xl font-medium text-left pb-4">
            Our Expert Interviewers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertsOpinion.map((expert, index) => (
              <motion.div
                key={index}
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Image
                  src={expert.expertImg}
                  alt={expert.expertName}
                  width={100}
                  height={100}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-2xl sm:text-3xl font-bold">
                  {expert.expertName}
                </h3>
                <p className="text-lg sm:text-xl font-medium">
                  {expert.details}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
        <section className="px-5 sm:px-12 py-6">
          <h2 className="text-2xl sm:text-3xl font-medium text-left pb-4">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {successStories.map((user, index) => (
              <motion.div
                key={index}
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Image
                  src={user.userImg}
                  alt={user.userName}
                  width={80}
                  height={80}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-2xl sm:text-3xl font-bold">
                  {user.userName}
                </h3>
                <p className="text-lg sm:text-xl font-medium">
                  {user.feedback}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
        <section className="flex flex-col sm:flex-row items-center justify-between px-5 sm:px-12 py-6 gap-6">
          <h2 className="text-2xl sm:text-3xl font-medium pb-4 sm:pb-0">
            Ready to Ace Your Next Interview?
          </h2>
          <div className="flex gap-4 sm:gap-6">
            <Link href="/register">
              <Button className="btn-primary">Sign Up</Button>
            </Link>
            <Link href="/login">
              <Button className="btn-primary">Log In</Button>
            </Link>
          </div>
        </section>
      </motion.div>
    </AnimatePresence>
  );
};

export default HomePage;
