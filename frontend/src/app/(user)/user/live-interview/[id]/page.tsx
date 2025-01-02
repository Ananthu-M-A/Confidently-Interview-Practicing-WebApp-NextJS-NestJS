"use client";

import WithAuth from "@/components/auth-guards/WithAuth";
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
      isExpert={false}
    />
  );
};

export default WithAuth(VideoPage);
