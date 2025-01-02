"use client";

import WithExpertAuth from "@/components/auth-guards/WithExpertAuth";
import VideoCall from "@/components/VideoCall";
import { useParams } from "next/navigation";

const VideoPage = () => {
  const { id }: { id: string } = useParams();

  if (!id) return <div>Loading...</div>;

  return (
    <VideoCall
      roomId={id}
      userName={"User"}
      expertName={"Expert"}
      subject={"Subject"}
      isExpert={true}
    />
  );
};

export default WithExpertAuth(VideoPage);
