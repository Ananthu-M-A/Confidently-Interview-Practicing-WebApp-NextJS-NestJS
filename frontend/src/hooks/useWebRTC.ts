import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

export const useWebRTC = (roomId: string) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [videoOn, setVideoOn] = useState<boolean>(true);
  const [micOn, setMicOn] = useState<boolean>(true);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia(
        { video: videoOn, audio: micOn }
      );
      setLocalStream(stream);

      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('iceCandidate', { room: roomId, candidate: event.candidate });
        }
      };

      peerConnection.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });

      socket.emit('joinRoom', roomId);

      socket.on('offer', async ({ sdp }) => {
        await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await peerConnection.current?.createAnswer();
        await peerConnection.current?.setLocalDescription(answer);
        socket.emit('answer', { room: roomId, sdp: answer });
      });

      socket.on('answer', async ({ sdp }) => {
        await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(sdp));
      });

      socket.on('iceCandidate', async ({ candidate }) => {
        await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
      });
    };

    init();
  }, [micOn, roomId, videoOn]);

  const createOffer = async () => {
    const offer = await peerConnection.current?.createOffer();
    await peerConnection.current?.setLocalDescription(offer);
    socket.emit('offer', { room: roomId, sdp: offer });
  };

  const toggleCamera = async () => {
    setVideoOn(false);
  };

  const toggleMic = async () => {
    setMicOn(false);
  };

  const endCall = async () => {

  };

  return { localStream, remoteStream, createOffer, toggleCamera, toggleMic, endCall };
};
