import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Patient } from "@/adapters/types/ServiceProviderTypes";
import { useNavigate } from "@tanstack/react-router";

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  const navigate = useNavigate();
  const initials = `${patient.first_name[0]}${patient.last_name[0]}`;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">
            {patient.first_name} {patient.last_name}
          </h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{patient.email}</span>
          </div>
          {/* <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{patient.phone_number}</span>
          </div> */}

          {/* {patient.lastAppointment && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Last Visit: {patient.lastAppointment}</span>
            </div>
          )} */}
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            onClick={() => {
              navigate({
                to: "/patient/$patientId" as const,
                params: { patientId: patient.id },
              });
            }}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            View Details
          </Button>

          <Button disabled size="sm" className="flex-1">
            Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
