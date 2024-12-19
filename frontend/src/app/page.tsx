import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <>
      <div className="text-center my-6 px-4 sm:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Master Your Interview Skills With Confidently
        </h1>
        <p className="text-lg sm:text-xl font-medium mb-6">
          Practice real-time interviews with professional experts and boost your
          confidence.
        </p>
        <Button className="text-lg">
          <Link href="/register">Get Started</Link>
        </Button>
      </div>
      <section className="px-5 sm:px-12 py-6">
        <h2 className="text-2xl sm:text-3xl font-medium text-left pb-4">
          Why Interview Skills Matter
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Boost Confidence",
              description:
                "Practice makes perfect. Regular interviews help you feel more confident and prepared.",
            },
            {
              title: "Improve Communication",
              description:
                "Learn to articulate your thoughts clearly and concisely in high-pressure situations.",
            },
            {
              title: "Get Expert Feedback",
              description:
                "Receive valuable insights from industry professionals to help you improve.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="border border-gray-300 p-4 rounded-lg text-center"
            >
              <h3 className="text-xl sm:text-2xl font-bold">{item.title}</h3>
              <p className="text-lg sm:text-xl font-medium">
                {item.description}
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
          {[
            {
              name: "Nakul",
              details:
                "15+ years experience in software engineering. Former tech lead at Google.",
            },
            {
              name: "Sruthi",
              details:
                "Data Scientist with 10 years experience. PhD in Machine Learning from MIT.",
            },
            {
              name: "Ajith",
              details:
                "Product Manager with experience at startups and Fortune 500 companies.",
            },
          ].map((expert, index) => (
            <div
              key={index}
              className="border border-gray-300 p-4 rounded-lg text-center"
            >
              <h3 className="text-2xl sm:text-3xl font-bold">{expert.name}</h3>
              <p className="text-lg sm:text-xl font-medium">{expert.details}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="px-5 sm:px-12 py-6">
        <h2 className="text-2xl sm:text-3xl font-medium text-left pb-4">
          Success Stories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {[
            {
              name: "Vyshak",
              feedback:
                '"Thanks to Confidently, I aced my interview at a top company. The feedback from experts was invaluable."',
            },
            {
              name: "Ananthu",
              feedback:
                '"I improved my communication skills significantly. Now I feel confident in any interview situation."',
            },
          ].map((story, index) => (
            <div
              key={index}
              className="border border-gray-300 p-4 rounded-lg text-center"
            >
              <h3 className="text-2xl sm:text-3xl font-bold">{story.name}</h3>
              <p className="text-lg sm:text-xl font-medium">{story.feedback}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col sm:flex-row items-center justify-between px-5 sm:px-12 py-6 gap-6">
        <h2 className="text-2xl sm:text-3xl font-medium pb-4 sm:pb-0">
          Ready to Ace Your Next Interview?
        </h2>
        <div className="flex gap-4 sm:gap-6">
          <Button className="text-lg">
            <Link href="/register">Sign Up</Link>
          </Button>
          <Button variant="outline" className="text-lg border-black">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default HomePage;