import {
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  LocalUser,
} from "agora-rtc-react";
import { Avatar } from "@/components/ui/avatar"; // Assuming you have this component
import { MicOff } from "lucide-react";

interface LocalVideoViewProps {
  localMicrophoneTrack: IMicrophoneAudioTrack | null;
  localCameraTrack: ICameraVideoTrack | null;
  cameraOn: boolean;
  micOn: boolean;
  localUserVolumeLevel: number;
}

export function LocalVideoView({
  localMicrophoneTrack,
  localCameraTrack,
  cameraOn,
  micOn,
  localUserVolumeLevel,
}: LocalVideoViewProps) {
  return (
    <div
      className={`relative w-[280px] h-[157.5px] bg-gray-800 rounded-lg overflow-hidden
      ${localUserVolumeLevel > 0.45 ? "ring-2 ring-primary" : ""}`}
    >
      {/* Mute indicator */}
      {!micOn && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-gray-900/80 p-2 rounded-full">
            <MicOff className="h-4 w-4 text-white" />
          </div>
        </div>
      )}

      {/* Video container */}
      <div className="w-full h-full">
        {cameraOn ? (
          <LocalUser
            audioTrack={localMicrophoneTrack}
            videoTrack={localCameraTrack}
            cameraOn={cameraOn}
            micOn={micOn}
            playAudio={false}
            playVideo={cameraOn}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Avatar className="h-20 w-20" />
          </div>
        )}
      </div>
    </div>
  );
}
