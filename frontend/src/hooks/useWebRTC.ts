import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

export const useWebRTC = (roomId: string) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [videoOn, setVideoOn] = useState<boolean>(true);
  const [micOn, setMicOn] = useState<boolean>(true);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
      peerConnection.current?.close();
      socket.off('offer');
      socket.off('answer');
      socket.off('iceCandidate');
    };
  }, [roomId]);

  const createOffer = async () => {
    const offer = await peerConnection.current?.createOffer();
    await peerConnection.current?.setLocalDescription(offer);
    socket.emit('offer', { room: roomId, sdp: offer });
  };

  const toggleCamera = async () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
      setVideoOn((prev) => !prev);
    }
  };

  const toggleMic = async () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
      setMicOn((prev) => !prev);
    }
  };

  const endCall = async () => {
    localStream?.getTracks().forEach((track) => track.stop());
    peerConnection.current?.close();
    socket.emit('leaveRoom', roomId);
  };

  const startRecording = () => {
    if (localStream) {
      const recorder = new MediaRecorder(localStream, { mimeType: 'video/webm; codecs=vp9' });
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.start();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      console.log('Recording saved:', url);
      setRecordedChunks([]);
    }
  };

  return {
    localStream,
    remoteStream,
    createOffer,
    toggleCamera,
    toggleMic,
    endCall,
    startRecording,
    stopRecording,
  };
};
