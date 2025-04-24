"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useRemoteUsers,
  useRemoteAudioTracks,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  useRTCClient,
  useVolumeLevel,
  useConnectionState,
  useNetworkQuality,
} from "agora-rtc-react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { toast } from "sonner";
import { LocalVideoView } from "./local-video-view";
import { RemoteVideoView } from "./remote-video-view";
import { useRouter } from "@tanstack/react-router";

export default function AppointmentRoom({
  token,
  channel,
  uid,
}: {
  token: string;
  channel: string;
  uid: string;
}) {
  const router = useRouter();
  const agoraClient = useRTCClient();
  const connectionState = useConnectionState();
  const networkQuality = useNetworkQuality();

  // //eslint-disable-next-line
  // const hasConnected = useRef(false);
  // //eslint-disable-next-line
  // const joinAttempts = useRef(0);
  // //eslint-disable-next-line

  //eslint-disable-next-line
  const [activeConnection, _setActiveConnection] = useState(true);
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const [lastWarningTime, setLastWarningTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);

  // Get tracks using hooks
  const audioTrack = useLocalMicrophoneTrack(micOn);
  const cameraTrack = useLocalCameraTrack(cameraOn);

  // Move readyToPublish check to include isConnected
  const readyToPublish =
    agoraClient.connectionState === "CONNECTED" &&
    audioTrack.localMicrophoneTrack &&
    cameraTrack.localCameraTrack;

  const localUserVolumeLevel = useVolumeLevel(audioTrack.localMicrophoneTrack!);

  // Join channel with proper error handling
  const { isConnected, isLoading } = useJoin(
    {
      appid: "145cb3730d4a4445bf93a36407675ff4",
      channel: channel,
      token: token.split(" ").join("+")!,
      uid: Number(uid),
    },
    activeConnection
  );

  console.log(isConnected);

  const handlePublishTracks = async () => {
    console.log(readyToPublish);

    try {
      // Double check connection status
      if (!isConnected) {
        console.log("Not connected to channel yet");
        return;
      }

      if (!readyToPublish) {
        console.log("Tracks not ready yet");
        return;
      }

      await agoraClient.setClientRole("host");

      const publishedTracks = agoraClient.localTracks;
      if (publishedTracks.length > 0) {
        console.log("Tracks already published");
        return;
      }

      console.log("Publishing tracks...");
      //@ts-expect-error audioTrack.localMicrophoneTrack is not null
      const res = await agoraClient.publish([
        audioTrack.localMicrophoneTrack,
        cameraTrack.localCameraTrack,
      ]);
      console.log(res);
      console.log("Tracks published successfully");
    } catch (error) {
      console.error("Failed to publish stream:", error);
      toast.error("Failed to publish media stream");
    }
  };

  // Modify the publish effect to wait for connection
  useEffect(() => {
    if (readyToPublish && isConnected) {
      console.log("Attempting to publish tracks...");
      handlePublishTracks();
    }
  }, [readyToPublish]);

  // Handle remote users
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  // Play remote audio tracks
  // Play audio tracks for remote users only
  audioTracks.map((track) => track.play());
  // useEffect(() => {
  //   audioTracks.forEach((track) => track.play());
  // }, [audioTracks]);

  // Network quality monitoring
  const warningCooldown = 60000;
  const checkNetworkQuality = useCallback(() => {
    const currentTime = Date.now();
    if (
      networkQuality.delay > 300 &&
      currentTime - lastWarningTime > warningCooldown
    ) {
      toast.warning("Unstable Internet Connection", {
        duration: 5000,
        id: "network-warning",
      });
      setLastWarningTime(currentTime);
    }
  }, [networkQuality.delay, lastWarningTime]);

  useEffect(() => {
    checkNetworkQuality();
  }, [checkNetworkQuality]);

  // Initial mute state
  // useEffect(() => {
  //   if (audioTrack.localMicrophoneTrack || cameraTrack.localCameraTrack) {
  //     audioTrack.localMicrophoneTrack?.setMuted(true);
  //     cameraTrack.localCameraTrack?.setMuted(true);
  //   }
  // }, [audioTrack.localMicrophoneTrack, cameraTrack.localCameraTrack]);

  // Add connection state logging
  useEffect(() => {
    console.log("Connection state changed:", connectionState);
  }, [connectionState]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleEndCall();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVideoMute = async () => {
    if (cameraTrack.localCameraTrack) {
      await cameraTrack.localCameraTrack.setEnabled(!cameraOn);
      setCamera(!cameraOn);
    }
  };

  const handleAudioMute = async () => {
    if (audioTrack.localMicrophoneTrack) {
      await audioTrack.localMicrophoneTrack.setEnabled(!micOn);
      setMic(!micOn);
    }
  };

  const handleEndCall = async () => {
    try {
      if (audioTrack.localMicrophoneTrack) {
        audioTrack.localMicrophoneTrack.close();
      }
      if (cameraTrack.localCameraTrack) {
        cameraTrack.localCameraTrack.close();
      }
      await agoraClient.leave();
      router.navigate({ to: "/dashboard" });
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Connecting to video call...</p>
        </div>
      </div>
    );
  }

  // Your existing UI render code here
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto relative">
        {/* Timer */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gray-800 rounded-lg px-4 py-2 text-white">
            {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        </div>

        {/* Remote Stream */}
        <div className="w-full h-[80vh] bg-gray-800 rounded-2xl overflow-hidden">
          {remoteUsers.map((user) => (
            <RemoteVideoView key={user.uid} user={user} />
          ))}
        </div>

        {/* Local Stream */}
        <div className="absolute bottom-4 left-4 z-10">
          <LocalVideoView
            localMicrophoneTrack={audioTrack.localMicrophoneTrack}
            localCameraTrack={cameraTrack.localCameraTrack}
            cameraOn={cameraOn}
            micOn={micOn}
            localUserVolumeLevel={localUserVolumeLevel}
          />
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <Button
            onClick={handleAudioMute}
            variant={micOn ? "secondary" : "destructive"}
            size="lg"
            className="rounded-full h-12 w-12"
          >
            {micOn ? <Mic /> : <MicOff />}
          </Button>

          <Button
            onClick={handleEndCall}
            variant="destructive"
            size="lg"
            className="rounded-full h-14 w-14"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>

          <Button
            onClick={handleVideoMute}
            variant={cameraOn ? "secondary" : "destructive"}
            size="lg"
            className="rounded-full h-12 w-12"
          >
            {cameraOn ? <Video /> : <VideoOff />}
          </Button>
        </div>
      </div>
    </div>
  );
}
