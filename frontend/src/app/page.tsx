import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { features } from "@/constants/features";
import { expertsOpinion } from "@/constants/opinions";
import { successStories } from "@/constants/stories";

const HomePage = () => {
  return (
    <>
      <section className="text-center my-6 px-4 sm:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Master Your Interview Skills With Confidently
        </h1>
        <p className="text-lg sm:text-xl font-medium mb-6">
          Practice real-time interviews with professional experts and boost your
          confidence.
        </p>
        <Button asChild size="lg">
          <Link href="/register">Get Started</Link>
        </Button>
      </section>
      <section className="px-5 sm:px-12 py-6">
        <h2 className="text-2xl sm:text-3xl font-medium text-left pb-4">
          Why Interview Skills Matter
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border border-gray-300 p-4 rounded-lg text-center"
            >
              <h3 className="text-xl sm:text-2xl font-bold">{feature.title}</h3>
              <p className="text-lg sm:text-xl font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="px-5 sm:px-12 py-6">
        <h2 className="text-2xl sm:text-3xl font-medium text-left pb-4">
          Our Expert Interviewers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {expertsOpinion.map((expert, index) => (
            <div
              key={index}
              className="border border-gray-300 p-4 rounded-lg text-center"
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
              <p className="text-lg sm:text-xl font-medium">{expert.details}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="px-5 sm:px-12 py-6">
        <h2 className="text-2xl sm:text-3xl font-medium text-left pb-4">
          Success Stories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {successStories.map((user, index) => (
            <div
              key={index}
              className="border border-gray-300 p-4 rounded-lg text-center"
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
              <p className="text-lg sm:text-xl font-medium">{user.feedback}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col sm:flex-row items-center justify-between px-5 sm:px-12 py-6 gap-6">
        <h2 className="text-2xl sm:text-3xl font-medium pb-4 sm:pb-0">
          Ready to Ace Your Next Interview?
        </h2>
        <div className="flex gap-4 sm:gap-6">
          <Button asChild size="lg">
            <Link href="/register">Sign Up</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-black">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default HomePage;
