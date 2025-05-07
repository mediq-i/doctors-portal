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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Prescription } from "@/adapters/types/PrescriptionTypes";

interface PrescriptionCardProps {
  prescription: Prescription;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function PrescriptionCard({
  prescription,
  onDelete,
  isDeleting = false,
}: PrescriptionCardProps) {
  console.log(prescription);
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{prescription.medication}</CardTitle>
            <CardDescription>{prescription.dosage}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDelete(String(prescription.id))}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="h-4 w-4 text-destructive animate-pulse">
                ...
              </span>
            ) : (
              <Trash2 className="h-4 w-4 text-destructive" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Prescription Details</DialogTitle>
              <DialogDescription>
                Complete information about the prescription
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium">Medication</h4>
                <p className="text-sm text-muted-foreground">
                  {prescription.medication}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Dosage</h4>
                <p className="text-sm text-muted-foreground">
                  {prescription.dosage}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Frequency</h4>
                <p className="text-sm text-muted-foreground">
                  {prescription.frequency}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Duration</h4>
                <p className="text-sm text-muted-foreground">
                  {prescription.duration}
                </p>
              </div>
              {prescription.notes && (
                <div className="space-y-2">
                  <h4 className="font-medium">Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    {prescription.notes}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <h4 className="font-medium">Prescribed On</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(prescription.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
