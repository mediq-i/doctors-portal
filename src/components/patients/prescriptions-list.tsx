import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

import {
  usePrescriptionQuery,
  usePrescriptionMutation,
  PrescriptionsAdapter,
} from "@/adapters/PrescriptionsAdapter";
import { Prescription } from "@/adapters/types/PrescriptionTypes";
import { toast } from "sonner";
import {
  Pill,
  Plus,
  Calendar,
  Clock,
  AlertCircle,
  User,
  Trash2,
} from "lucide-react";

interface PrescriptionsListProps {
  patientId: string;
}

export function PrescriptionsList({ patientId }: PrescriptionsListProps) {
  const userId = localStorage.getItem("user_id");
  const [showOnlyMine, setShowOnlyMine] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [prescription, setPrescription] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    notes: "",
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch prescriptions
  const {
    data: prescriptions,
    isLoading: isPrescriptionsLoading,
    refetch: refetchPrescriptions,
    error: fetchError,
  } = usePrescriptionQuery({
    queryKey: ["prescriptions", patientId],
    queryCallback: () => PrescriptionsAdapter.getPrescriptions({ patientId }),
    slug: patientId,
  });

  // Filter prescriptions based on user preference
  const filteredPrescriptions =
    prescriptions?.data?.filter((prescription: Prescription) => {
      if (showOnlyMine) {
        return prescription.service_provider_id === userId;
      }
      return true;
    }) || [];

  // Add prescription mutation (using mutateAsync)
  const { mutateAsync: addPrescriptionAsync, isPending: isAddingPrescription } =
    usePrescriptionMutation({
      mutationCallback: PrescriptionsAdapter.addPrescription,
    });

  // Delete prescription mutation
  const { mutateAsync: deletePrescriptionAsync } = usePrescriptionMutation({
    mutationCallback: PrescriptionsAdapter.deletePrescription,
  });

  const handleAddPrescription = async () => {
    try {
      await addPrescriptionAsync({
        patient_id: patientId,
        ...prescription,
      });
      setIsDialogOpen(false);
      setPrescription({
        medication: "",
        dosage: "",
        frequency: "",
        duration: "",
        notes: "",
      });
      refetchPrescriptions();
      toast.success("Prescription added successfully");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to add prescription";
      toast.error(message);
    }
  };

  const handleDeletePrescription = async (id: number) => {
    setDeletingId(id);
    try {
      await deletePrescriptionAsync({ id: String(id) });
      refetchPrescriptions();
      toast.success("Prescription deleted successfully");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete prescription";
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

  const isCreatedByUser = (prescription: Prescription) => {
    return prescription.service_provider_id === userId;
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Pill className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Prescriptions</CardTitle>
              <CardDescription>
                Patient's medication history and current prescriptions
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
                <span className="hidden sm:inline">
                  Prescriptions issued by you
                </span>
                <span className="sm:hidden">Yours</span>
              </Button>
              <Button
                variant={!showOnlyMine ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOnlyMine(false)}
                className="flex-1 sm:flex-none text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">All Prescriptions</span>
                <span className="sm:hidden">All</span>
              </Button>
            </div>

            {/* Add Prescription Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add Prescription</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl w-[95vw] sm:w-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl font-bold">
                    Add New Prescription
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    Enter comprehensive prescription details for the patient
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 sm:space-y-6 py-4 sm:py-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="medication"
                        className="text-sm font-semibold"
                      >
                        Medication Name *
                      </Label>
                      <Input
                        id="medication"
                        value={prescription.medication}
                        onChange={(e) =>
                          setPrescription({
                            ...prescription,
                            medication: e.target.value,
                          })
                        }
                        placeholder="e.g., Amoxicillin, Ibuprofen"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dosage" className="text-sm font-semibold">
                        Dosage *
                      </Label>
                      <Input
                        id="dosage"
                        value={prescription.dosage}
                        onChange={(e) =>
                          setPrescription({
                            ...prescription,
                            dosage: e.target.value,
                          })
                        }
                        placeholder="e.g., 500mg, 10ml"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="frequency"
                        className="text-sm font-semibold"
                      >
                        Frequency *
                      </Label>
                      <Input
                        id="frequency"
                        value={prescription.frequency}
                        onChange={(e) =>
                          setPrescription({
                            ...prescription,
                            frequency: e.target.value,
                          })
                        }
                        placeholder="e.g., Twice daily, Every 8 hours"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="duration"
                        className="text-sm font-semibold"
                      >
                        Duration *
                      </Label>
                      <Input
                        id="duration"
                        value={prescription.duration}
                        onChange={(e) =>
                          setPrescription({
                            ...prescription,
                            duration: e.target.value,
                          })
                        }
                        placeholder="e.g., 7 days, 2 weeks"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-semibold">
                      Additional Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={prescription.notes}
                      onChange={(e) =>
                        setPrescription({
                          ...prescription,
                          notes: e.target.value,
                        })
                      }
                      placeholder="Enter any special instructions, side effects to watch for, or additional clinical notes..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>
                <DialogFooter className="gap-3 flex-col sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isAddingPrescription}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddPrescription}
                    disabled={
                      isAddingPrescription ||
                      !prescription.medication.trim() ||
                      !prescription.dosage.trim() ||
                      !prescription.frequency.trim() ||
                      !prescription.duration.trim()
                    }
                    className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                  >
                    {isAddingPrescription ? "Adding..." : "Add Prescription"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {isPrescriptionsLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            Loading prescriptions...
          </div>
        ) : fetchError ? (
          <div className="text-center py-8 text-destructive">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">
              Error loading prescriptions
            </p>
            <p className="text-sm text-muted-foreground">
              {String(fetchError)}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPrescriptions.map((prescription: Prescription) => (
              <div
                key={String(prescription.id)}
                className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 sm:p-6 border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full">
                    <div className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                      Prescription
                    </div>
                    {isCreatedByUser(prescription) && (
                      <div className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="hidden sm:inline">Created by you</span>
                        <span className="sm:hidden">Yours</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground w-full sm:w-auto">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">
                        {formatDate(prescription.created_at)}
                      </span>
                      <span className="sm:hidden">
                        {new Date(prescription.created_at).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                      <span className="hidden sm:inline">
                        {new Date(prescription.created_at).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                      <span className="sm:hidden">
                        {new Date(prescription.created_at).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  {isCreatedByUser(prescription) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === prescription.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 self-end sm:self-auto"
                        >
                          {deletingId === prescription.id ? (
                            <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete Prescription
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this prescription?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDeletePrescription(prescription.id)
                            }
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Prescription
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base break-words">
                      {prescription.medication}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
                    <div className="space-y-1">
                      <span className="font-medium text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                        Dosage:
                      </span>
                      <p className="text-gray-900 dark:text-white text-sm break-words">
                        {prescription.dosage}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-medium text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                        Frequency:
                      </span>
                      <p className="text-gray-900 dark:text-white text-sm break-words">
                        {prescription.frequency}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-medium text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                        Duration:
                      </span>
                      <p className="text-gray-900 dark:text-white text-sm break-words">
                        {prescription.duration}
                      </p>
                    </div>
                  </div>

                  {prescription.notes && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <span className="font-medium text-blue-700 dark:text-blue-300 text-xs sm:text-sm">
                        Notes:
                      </span>
                      <p className="text-blue-800 dark:text-blue-200 text-xs sm:text-sm mt-1 whitespace-pre-wrap break-words">
                        {prescription.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {filteredPrescriptions.length === 0 && (
              <div className="text-center py-12">
                <Pill className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {showOnlyMine
                    ? "No prescriptions created by you"
                    : "No prescriptions yet"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 px-4">
                  {showOnlyMine
                    ? "You haven't created any prescriptions for this patient yet."
                    : "Start managing patient medications by adding your first prescription."}
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Prescription
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
