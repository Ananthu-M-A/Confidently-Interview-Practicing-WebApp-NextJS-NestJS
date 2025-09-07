"use client";

import Loading from "@/app/loading";
import WithAuth from "@/components/auth-guards/WithAuth";
import { useAuth } from "@/contexts/auth/AuthContext";
import axiosClient from "@/lib/axiosClient";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get ? searchParams.get("session_id") : undefined;
  const router = useRouter();
  const { setSubscription } = useAuth();

  useEffect(() => {
    async function updateSubscription() {
      try {
        await axiosClient.get(`/stripe/success`, {
          params: {
            sessionId: JSON.stringify(sessionId),
          },
        });
        setSubscription(true);
        router.push("/user/subscriptions");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.message);
        } else {
          console.log(`Something went wrong`);
        }
      }
    }
    updateSubscription();
  }, [router, sessionId, setSubscription]);

  return (
    <>
      {!sessionId ? (
        <Loading />
      ) : (
        <div className="h-screen flex items-center justify-center mx-auto px-4">
          <h1 className="text-lg font-semibold text-center">
            Payment under processing
          </h1>
        </div>
      )}
    </>
  );
};

export default WithAuth(SuccessPage);
