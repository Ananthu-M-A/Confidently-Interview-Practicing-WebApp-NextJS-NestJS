"use client";

import WithAuth from "@/components/auth-guards/WithAuth";
import VideoCall from "@/components/VideoCall";
import { useParams } from "next/navigation";


const VideoPage = () => {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;

  if (!id) return <div>Loading...</div>;

  return (
    <VideoCall
      roomId={id}
      userName={"User"}
      expertName={"Expert"}
      subject={"Subject"}
      isExpert={false}
    />
  );
};

export default WithAuth(VideoPage);
