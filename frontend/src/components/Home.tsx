import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const Home = () => {
  return (
    <>
      <div className="flex-1 text-center my-6 p-2">
        <h1 className="text-4xl font-bold mb-2 text-center">
          Master Your Interview Skills With Confidently
        </h1>
        <p className="text-lg font-medium mb-3">
          Practice real-time interviews with professional experts and boost your
          confidence.
        </p>
        <Button className="text-lg">
          <Link href={"/register"}>Get Started</Link>
        </Button>
      </div>
      <h1 className="text-3xl font-medium text-left pb-2 pt-1 px-5">
        Why Interview Skills Matter
      </h1>
      <div className="p-5 flex justify-between gap-10 text-center">
        <div className="w-1/3 border border-gray-300 p-4 rounded-lg">
          <div>
            <h1 className="text-xl font-bold">Boost Confidence</h1>
            <p className="text-lg font-medium">
              Practce makes perfect. Regular interviews help you feel more
              confident and prepared.
            </p>
          </div>
        </div>
        <div className="w-1/3 border border-gray-300 p-4 rounded-lg">
          <div>
            <h1 className="text-xl font-bold">Improve Communication</h1>
            <p className="text-lg font-medium">
              Learn to articulate your thoughts clearly and concisely in
              high-pressure situations.
            </p>
          </div>
        </div>
        <div className="w-1/3 border border-gray-300 p-4 rounded-lg">
          <div>
            <h1 className="text-xl font-bold">Get Expert Feedback</h1>
            <p className="text-lg font-medium">
              Receive valuable insights from industry professionals to help you
              improve.
            </p>
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-medium text-left pb-2 pt-1 px-5">
        Our Expert Interviewers
      </h1>
      <div className="p-5 flex justify-between gap-10 text-center">
        <div className="w-1/3 border border-gray-300 p-4 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold">Nakul</h1>
            <p className="text-lg font-medium">
              15+ years experience in software engineering. Former tech lead at
              Google.
            </p>
          </div>
        </div>
        <div className="w-1/3 border border-gray-300 p-4 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold">Sruthi</h1>
            <p className="text-lg font-medium">
              Data Scientist with 10 years experience. PhD in Machine Learning
              from MIT.
            </p>
          </div>
        </div>
        <div className="w-1/3 border border-gray-300 p-4 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold">Ajith</h1>
            <p className="text-lg font-medium">
              Product Manager with experience at startups and Fortune 500
              companies.
            </p>
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-medium text-left pb-2 pt-1 px-5">
        Success Stories
      </h1>
      <div className="p-5 flex justify-between gap-10 text-center">
        <div className="w-1/2 border border-gray-300 p-4 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold">Vyshak</h1>
            <p className="text-lg font-medium">
              {`"Thanks to Confidently, I aced my interview at a top company. The feedbacks from experts was invaluable."`}
            </p>
          </div>
        </div>
        <div className="w-1/2 border border-gray-300 p-4 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold">Ananthu</h1>
            <p className="text-lg font-medium">
              {`"I improved my communication skills significantly. Now I feel confident in any interview situation."`}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between py-5">
        <h1 className="text-3xl font-medium text-left pb-2 pt-1 px-10">
          Ready to Ace Your Next Interview?
        </h1>
        <div className="flex gap-2 justify-between text-center px-20 gap-20">
          <Button className="text-lg">
            <Link href={"/register"}>Sign Up</Link>
          </Button>
          <Button variant={"outline"} className="text-lg border-black">
            <Link href={"/login"}>Log In</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
