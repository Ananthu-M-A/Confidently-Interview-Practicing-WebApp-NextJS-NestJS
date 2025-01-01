"use client";

import VideoCall from "@/components/VideoCall";
import { useParams } from "next/navigation";

const VideoPage = () => {
  const { id }: { id: string } = useParams();

  if (!id) return <div>Loading...</div>;

  return <VideoCall roomId={id} />;
};

export default VideoPage;
