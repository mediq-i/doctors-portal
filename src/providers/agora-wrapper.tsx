import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";

interface IAgoraProvider {
  children: React.ReactNode;
}

const AgoraWrapper = ({ children }: IAgoraProvider) => {
  const client = AgoraRTC.createClient({ codec: "vp8", mode: "live" });
  console.log("[Agora Initialised]");

  return <AgoraRTCProvider client={client}>{children}</AgoraRTCProvider>;
};

export default AgoraWrapper;
