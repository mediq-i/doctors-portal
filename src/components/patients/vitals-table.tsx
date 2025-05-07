import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PatientVitals } from "@/adapters/types/ServiceProviderTypes";

interface VitalsTableProps {
  vitals: PatientVitals[];
}

export function VitalsTable({ vitals }: VitalsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Blood Pressure</TableHead>
          <TableHead>Heart Rate</TableHead>
          <TableHead>Temperature</TableHead>
          <TableHead>Sugar Level</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vitals.map((vital) => (
          <TableRow key={vital.id}>
            <TableCell>
              {new Date(vital.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>{vital.blood_pressure || "N/A"}</TableCell>
            <TableCell>{vital.heart_rate || "N/A"}</TableCell>
            <TableCell>{vital.temperature || "N/A"}</TableCell>
            <TableCell>{vital.sugar_level || "N/A"}</TableCell>
          </TableRow>
        ))}
        {vitals.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No vitals history available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
