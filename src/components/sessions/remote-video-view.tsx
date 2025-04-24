import { RemoteUser } from "agora-rtc-react";
import { MicOff } from "lucide-react";

interface RemoteVideoViewProps {
  //@ts-expect-error user is not null
  user: RemoteUser;
}

export function RemoteVideoView({ user }: RemoteVideoViewProps) {
  //   useEffect(() => {
  //     if (user.videoTrack) {
  //       user.videoTrack.play(`remote-video-${user.uid}`);
  //     }
  //     if (user.audioTrack) {
  //       user.audioTrack.play();
  //     }

  //     return () => {
  //       user.videoTrack?.stop();
  //       user.audioTrack?.stop();
  //     };
  //   }, [user.videoTrack, user.audioTrack, user.uid]);

  console.log("user");

  return (
    <div className="w-full h-full relative">
      {/* {user.videoTrack ? (
        <div id={`remote-video-${user.uid}`} className="w-full h-full">
          <RemoteUser user={user} />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Avatar className="h-20 w-20" />
        </div>
      )} */}

      <div id={`remote-video-${user.uid}`} className="w-full h-full">
        <RemoteUser user={user} />
      </div>

      {user.hasAudio === false && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-gray-900/80 p-2 rounded-full">
            <MicOff className="h-4 w-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
