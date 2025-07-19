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
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { LocalVideoView } from "./local-video-view";
import { RemoteVideoView } from "./remote-video-view";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  PrescriptionsAdapter,
  usePrescriptionMutation,
} from "@/adapters/PrescriptionsAdapter";
import {
  SessionNotesAdapter,
  useSessionNotesMutation,
} from "@/adapters/SessionNotesAdapter";

export default function AppointmentRoom({
  token,
  channel,
  uid,
  patientId,
  appointmentId,
}: {
  token: string;
  channel: string;
  uid: string;
  patientId: string;
  appointmentId: string;
}) {
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
  const [timeLeft, setTimeLeft] = useState(1800);
  const [warningsShown, setWarningsShown] = useState({
    tenMinutes: false,
    fiveMinutes: false,
    timeUp: false,
  });

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
        const newTime = prev - 1;

        // Show warning when 10 minutes remaining (600 seconds)
        if (newTime === 600 && !warningsShown.tenMinutes) {
          toast.warning("10 minutes remaining in your session", {
            duration: 5000,
            id: "ten-minute-warning",
          });
          setWarningsShown((prev) => ({ ...prev, tenMinutes: true }));
        }

        // Show warning when 5 minutes remaining (300 seconds)
        if (newTime === 300 && !warningsShown.fiveMinutes) {
          toast.warning("5 minutes remaining in your session", {
            duration: 5000,
            id: "five-minute-warning",
          });
          setWarningsShown((prev) => ({ ...prev, fiveMinutes: true }));
        }

        // Show final warning when time is up
        if (newTime <= 0 && !warningsShown.timeUp) {
          toast.error("Session time has expired", {
            duration: 10000,
            id: "time-up-warning",
          });
          setWarningsShown((prev) => ({ ...prev, timeUp: true }));
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [warningsShown]);

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
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  // Notes & Prescription modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] =
    useState(false);
  const [prescription, setPrescription] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    notes: "",
  });

  // Add prescription mutation (using mutateAsync)
  const { mutateAsync: addPrescriptionAsync, isPending: isAddingPrescription } =
    usePrescriptionMutation({
      mutationCallback: PrescriptionsAdapter.addPrescription,
    });

  const { mutateAsync: addSessionNoteAsync, isPending: isAddingSessionNote } =
    useSessionNotesMutation({
      mutationCallback: SessionNotesAdapter.addSessionNote,
    });

  const handleAddPrescription = async () => {
    try {
      await addPrescriptionAsync({
        patient_id: patientId,
        ...prescription,
      });
      setIsPrescriptionDialogOpen(false);
      setPrescription({
        medication: "",
        dosage: "",
        frequency: "",
        duration: "",
        notes: "",
      });

      toast.success("Prescription added successfully");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to add prescription";
      toast.error(message);
    }
  };

  const handleAddSessionNote = async () => {
    try {
      await addSessionNoteAsync({
        patient_id: patientId,
        note: notes,
        appointment_id: appointmentId,
      });
      setModalOpen(false);
      setNotes("");

      toast.success("Session note added successfully");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to add session note";
      toast.error(message);
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
    <div className="min-h-screen bg-gray-900 p-2 sm:p-6">
      <div className="md:max-w-7xl mx-auto relative">
        {/* Timer */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
          <div className="bg-gray-800 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-white text-sm sm:text-base">
            {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        </div>

        {/* Video Streams Layout */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full h-[60vh] sm:h-[80vh]">
          {/* Remote Stream */}
          <div className="flex-1 bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center">
            {remoteUsers.length > 0 ? (
              remoteUsers.map((user) => (
                <RemoteVideoView key={user.uid} user={user} />
              ))
            ) : (
              <div className="text-white text-center opacity-60">
                Waiting for participant...
              </div>
            )}
          </div>
          {/* Local Stream */}
          <div className="w-full sm:w-[350px] py-4 sm:h-full bg-gray-900 rounded-xl overflow-hidden flex flex-col gap-6 items-center justify-center border border-gray-700">
            <LocalVideoView
              localMicrophoneTrack={audioTrack.localMicrophoneTrack}
              localCameraTrack={cameraTrack.localCameraTrack}
              cameraOn={cameraOn}
              micOn={micOn}
              localUserVolumeLevel={localUserVolumeLevel}
            />

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center">
              <Button
                onClick={handleAudioMute}
                variant={micOn ? "secondary" : "destructive"}
                size="icon"
                className="rounded-full h-10 w-10 sm:h-12 sm:w-12"
              >
                {micOn ? <Mic /> : <MicOff />}
              </Button>

              <Button
                onClick={handleEndCall}
                variant="destructive"
                size="icon"
                className="rounded-full h-12 w-12 sm:h-14 sm:w-14"
              >
                <PhoneOff className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>

              <Button
                onClick={handleVideoMute}
                variant={cameraOn ? "secondary" : "destructive"}
                size="icon"
                className="rounded-full h-10 w-10 sm:h-12 sm:w-12"
              >
                {cameraOn ? <Video /> : <VideoOff />}
              </Button>

              {/* Notes & Prescription Button */}
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 sm:h-12 sm:w-12"
                onClick={() => setModalOpen(true)}
                title="Add Notes"
              >
                <span className="font-bold text-lg">✎</span>
              </Button>
              {/*  Prescription Button */}

              <Dialog
                open={isPrescriptionDialogOpen}
                onOpenChange={setIsPrescriptionDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10 sm:h-12 sm:w-12"
                    title="Add A Prescription"
                  >
                    <span className="font-bold text-lg">💊</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Prescription</DialogTitle>
                    <DialogDescription>
                      Enter the prescription details for the patient
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="medication">Medication</Label>
                      <Input
                        id="medication"
                        value={prescription.medication}
                        onChange={(e) =>
                          setPrescription({
                            ...prescription,
                            medication: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dosage">Dosage</Label>
                      <Input
                        id="dosage"
                        value={prescription.dosage}
                        onChange={(e) =>
                          setPrescription({
                            ...prescription,
                            dosage: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Input
                        id="frequency"
                        value={prescription.frequency}
                        onChange={(e) =>
                          setPrescription({
                            ...prescription,
                            frequency: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={prescription.duration}
                        onChange={(e) =>
                          setPrescription({
                            ...prescription,
                            duration: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={prescription.notes}
                        onChange={(e) =>
                          setPrescription({
                            ...prescription,
                            notes: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsPrescriptionDialogOpen(false)}
                      disabled={isAddingPrescription}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddPrescription}
                      disabled={isAddingPrescription}
                    >
                      {isAddingPrescription ? "Adding..." : "Add Prescription"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Notes */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Notes</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={10}
                    placeholder="Type your notes here..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddSessionNote}
                  disabled={isAddingSessionNote}
                >
                  {isAddingSessionNote ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
