"use client";

import WithExpertAuth from "@/components/auth-guards/WithExpertAuth";
import VideoCall from "@/components/VideoCall";
import { useParams } from "next/navigation";


const VideoPage = () => {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;

  if (!id) return <div>Loading...</div>;

  return (
    <VideoCall
      roomId={id}
      userName={"Expert"}
      expertName={"Expert"}
      subject={"Subject"}
      isExpert={true}
    />
  );
};

export default WithExpertAuth(VideoPage);
