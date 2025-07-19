import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  useSessionNotesQuery,
  useSessionNotesMutation,
  SessionNotesAdapter,
} from "@/adapters/SessionNotesAdapter";
import { SessionNote } from "@/adapters/types/SessionNotesTypes";
import { toast } from "sonner";
import {
  FileText,
  //   Plus,
  Calendar,
  Clock,
  AlertCircle,
  User,
  Trash2,
} from "lucide-react";

interface SessionNotesListProps {
  patientId: string;
}

export function SessionNotesList({ patientId }: SessionNotesListProps) {
  const userId = localStorage.getItem("user_id");
  const [showOnlyMine, setShowOnlyMine] = useState(true);

  //   const [isDialogOpen, setIsDialogOpen] = useState(false);
  //   const [note, setNote] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch session notes
  const {
    data: sessionNotes,
    isLoading: isSessionNotesLoading,
    refetch: refetchSessionNotes,
    error: fetchError,
  } = useSessionNotesQuery({
    queryKey: ["session-notes", patientId],
    queryCallback: () => SessionNotesAdapter.getSessionNotes({ patientId }),
    slug: patientId,
  });

  // Filter session notes based on user preference
  const filteredSessionNotes =
    sessionNotes?.data?.filter((sessionNote: SessionNote) => {
      if (showOnlyMine) {
        return sessionNote.service_provider_id === userId;
      }
      return true;
    }) || [];

  // Add session note mutation
  //   const { mutateAsync: addSessionNoteAsync, isPending: isAddingSessionNote } =
  //     useSessionNotesMutation({
  //       mutationCallback: SessionNotesAdapter.addSessionNote,
  //     });

  // Delete session note mutation
  const { mutateAsync: deleteSessionNoteAsync } = useSessionNotesMutation({
    mutationCallback: SessionNotesAdapter.deleteSessionNote,
  });

  //   const handleAddSessionNote = async () => {
  //     try {
  //       await addSessionNoteAsync({
  //         patient_id: patientId,
  //         note: note,
  //         appointment_id: "0",
  //       });
  //       setIsDialogOpen(false);
  //       setNote("");
  //       refetchSessionNotes();
  //       toast.success("Session note added successfully");
  //     } catch (err: unknown) {
  //       const message =
  //         err instanceof Error ? err.message : "Failed to add session note";
  //       toast.error(message);
  //     }
  //   };

  const handleDeleteSessionNote = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteSessionNoteAsync({ id });
      refetchSessionNotes();
      toast.success("Session note deleted successfully");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete session note";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isCreatedByUser = (sessionNote: SessionNote) => {
    return sessionNote.service_provider_id === userId;
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Session Notes</CardTitle>
              <CardDescription>
                Clinical notes and observations from patient sessions
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Filter Buttons */}
            <div className="flex gap-1 w-full sm:w-auto">
              <Button
                variant={showOnlyMine ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOnlyMine(true)}
                className="flex-1 sm:flex-none text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Notes created by you</span>
                <span className="sm:hidden">Yours</span>
              </Button>
              <Button
                variant={!showOnlyMine ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOnlyMine(false)}
                className="flex-1 sm:flex-none text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">All Notes</span>
                <span className="sm:hidden">All</span>
              </Button>
            </div>

            {/* Add Note Button */}
            {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add Note</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl w-[95vw] sm:w-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl font-bold">
                    Add Session Note
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    Record clinical observations and notes from this patient
                    session
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Clinical Notes
                    </label>
                    <Textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={12}
                      placeholder="Enter detailed clinical notes, observations, treatment plans, or any other relevant information from this session..."
                      className="resize-none"
                    />
                  </div>
                </div>
                <DialogFooter className="gap-3 flex-col sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isAddingSessionNote}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddSessionNote}
                    disabled={isAddingSessionNote || !note.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto"
                  >
                    {isAddingSessionNote ? "Adding..." : "Add Note"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog> */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {isSessionNotesLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            Loading session notes...
          </div>
        ) : fetchError ? (
          <div className="text-center py-8 text-destructive">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Error loading notes</p>
            <p className="text-sm text-muted-foreground">
              {String(fetchError)}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessionNotes.map((sessionNote: SessionNote) => (
              <div
                key={String(sessionNote.id)}
                className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 sm:p-6 border border-indigo-200 dark:border-indigo-800 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full">
                    <div className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-1 rounded-full text-xs font-medium">
                      Session Note
                    </div>
                    {isCreatedByUser(sessionNote) && (
                      <div className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="hidden sm:inline">Created by you</span>
                        <span className="sm:hidden">Yours</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground w-full sm:w-auto">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">
                        {formatDate(sessionNote.created_at)}
                      </span>
                      <span className="sm:hidden">
                        {new Date(sessionNote.created_at).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                      <span className="hidden sm:inline">
                        {formatTime(sessionNote.created_at)}
                      </span>
                      <span className="sm:hidden">
                        {new Date(sessionNote.created_at).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  {isCreatedByUser(sessionNote) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === sessionNote.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 self-end sm:self-auto"
                        >
                          {deletingId === sessionNote.id ? (
                            <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete Session Note
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this session note?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDeleteSessionNote(sessionNote.id)
                            }
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Note
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words text-sm sm:text-base">
                    {sessionNote.note}
                  </p>
                </div>
              </div>
            ))}
            {filteredSessionNotes.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {showOnlyMine
                    ? "No notes created by you"
                    : "No session notes yet"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 px-4">
                  {showOnlyMine
                    ? "You haven't created any session notes for this patient yet."
                    : "Start documenting patient sessions by adding your first note."}
                </p>
                {/* <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Note
                </Button> */}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
