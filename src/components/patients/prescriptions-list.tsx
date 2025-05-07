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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { PrescriptionCard } from "./prescription-card";
import {
  usePrescriptionQuery,
  usePrescriptionMutation,
  PrescriptionsAdapter,
} from "@/adapters/PrescriptionsAdapter";
import { Prescription } from "@/adapters/types/PrescriptionTypes";
import { toast } from "sonner";

interface PrescriptionsListProps {
  patientId: string;
}

export function PrescriptionsList({ patientId }: PrescriptionsListProps) {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Prescriptions</CardTitle>
            <CardDescription>Patient's medication history</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Prescription</Button>
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
                  onClick={() => setIsDialogOpen(false)}
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
      </CardHeader>
      <CardContent>
        {isPrescriptionsLoading ? (
          <div className="text-center py-6 text-muted-foreground">
            Loading prescriptions...
          </div>
        ) : fetchError ? (
          <div className="text-center py-6 text-destructive">
            {String(fetchError)}
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions?.data?.map((prescription: Prescription) => (
              <PrescriptionCard
                key={String(prescription.id)}
                prescription={prescription}
                onDelete={() => handleDeletePrescription(prescription.id)}
                isDeleting={deletingId === prescription.id}
              />
            ))}
            {prescriptions?.data?.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No prescriptions available
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
