import React, { useRef, useEffect, useState } from "react";
import { useWebRTC } from "../hooks/useWebRTC";
import { FaRegClock, FaUser, FaFileAlt } from "react-icons/fa";
import { MdCallEnd } from "react-icons/md";
import {
  BiSolidMicrophone,
  BiSolidMicrophoneOff,
  BiSolidVideoOff,
  BiSolidVideoPlus,
  BiSolidVideoRecording,
} from "react-icons/bi";
import { io } from "socket.io-client";
import { toast } from "sonner";

interface Message {
  userName: string;
  message: string;
}

const socket = io("http://localhost:3001");

const VideoCall = ({
  roomId,
  userName,
  expertName,
  subject,
  isExpert,
}: {
  roomId: string;
  userName: string;
  expertName: string;
  subject: string;
  isExpert: boolean;
}) => {
  const {
    localStream,
    remoteStream,
    createOffer,
    toggleCamera,
    toggleMic,
    endCall,
    startRecording,
    stopRecording,
  } = useWebRTC(roomId);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  // const [codingNotes, setCodingNotes] = useState<string>("");
  const [privateNotes, setPrivateNotes] = useState<string>("");
  const [onlineCode, setOnlineCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [showCompiler, setShowCompiler] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [isCallStarted, setIsCallStarted] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (isCallStarted) {
      const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isCallStarted]);

  useEffect(() => {
    socket.on("chatMessage", (message) => {
      setChatMessages((prev) => [...prev, message]);
    });
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleToggleCamera = () => {
    toggleCamera();
    setIsCameraOn((prev) => !prev);
  };

  const handleToggleMic = () => {
    toggleMic();
    setIsMicOn((prev) => !prev);
  };

  const compileCode = async () => {
    try {
      const response = await fetch("https://api.example.com/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: onlineCode }),
      });
      if (!response.ok) throw new Error("Compile failed");
      const data = await response.json();
      setOutput(data.output);
      toast.success("Code compiled successfully!");
      socket.emit("saveCode", { roomId, code: onlineCode });
    } catch (error) {
      setOutput("Error compiling code.");
      toast.error("Error compiling code.");
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }
    socket.emit("chatMessage", { roomId, userName, message: newMessage });
    setNewMessage("");
    toast.success("Message sent!");
  };

  const handleStartCall = () => {
    if (isExpert) {
      createOffer();
      setIsCallStarted(true);
      startRecording();
      toast.success("Call started!");
    }
  };

  const handleEndCall = () => {
    if (isExpert) {
      endCall();
      setIsCallStarted(false);
      stopRecording();
      toast.success("Call ended.");
    }
  };

  const savePrivateNotes = () => {
  socket.emit("savePrivateNotes", { roomId, privateNotes });
  toast.success("Private notes saved!");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-black text-white rounded-2xl shadow-2xl border border-blue-900">
      {/* ...existing code... */}
      <div className="flex items-center justify-between bg-gray-900 px-6 py-3 rounded-t-2xl shadow-md">
        {/* ...existing code... */}
      </div>
      <div className="flex flex-1">
        <div className="flex flex-col flex-1 bg-black/80 p-4 rounded-bl-2xl">
          {/* ...existing code... */}
        </div>
        <div className="flex flex-col flex-1 bg-gray-800/80 p-4 rounded-br-2xl">
          {/* ...existing code... */}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
