import type React from "react";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface ProfessionalInfoFormProps {
  initialData: {
    licenseNumber: string;
    issuingBoard: string;
    primarySpecialty: string;
    subSpecialties: string[];
    yearsOfExperience: number;
    professionalAssociations: string[];
  };
}

export default function ProfessionalInfoForm({
  initialData,
}: ProfessionalInfoFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [newSubSpecialty, setNewSubSpecialty] = useState("");
  const [newAssociation, setNewAssociation] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleYearsChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      yearsOfExperience: Number.parseInt(value),
    }));
  };

  const addSubSpecialty = () => {
    if (
      newSubSpecialty.trim() &&
      !formData.subSpecialties.includes(newSubSpecialty.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        subSpecialties: [...prev.subSpecialties, newSubSpecialty.trim()],
      }));
      setNewSubSpecialty("");
    }
  };

  const removeSubSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      subSpecialties: prev.subSpecialties.filter((s) => s !== specialty),
    }));
  };

  const addAssociation = () => {
    if (
      newAssociation.trim() &&
      !formData.professionalAssociations.includes(newAssociation.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        professionalAssociations: [
          ...prev.professionalAssociations,
          newAssociation.trim(),
        ],
      }));
      setNewAssociation("");
    }
  };

  const removeAssociation = (association: string) => {
    setFormData((prev) => ({
      ...prev,
      professionalAssociations: prev.professionalAssociations.filter(
        (a) => a !== association
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would submit the data to your API
    toast("Professional information updated");
  };

  // Sample specialties for the dropdown
  const specialties = [
    "Cardiology",
    "Dermatology",
    "Emergency Medicine",
    "Family Medicine",
    "Gastroenterology",
    "Internal Medicine",
    "Neurology",
    "Obstetrics and Gynecology",
    "Oncology",
    "Ophthalmology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Radiology",
    "Surgery",
    "Urology",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="licenseNumber">Medical License Number</Label>
          <Input
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="issuingBoard">Issuing Medical Board</Label>
          <Input
            id="issuingBoard"
            name="issuingBoard"
            value={formData.issuingBoard}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="primarySpecialty">Primary Specialty</Label>
        <Select
          value={formData.primarySpecialty}
          onValueChange={(value) =>
            handleSelectChange("primarySpecialty", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a specialty" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Sub-Specialties</Label>
        <div className="flex flex-wrap gap-2">
          {formData.subSpecialties.map((specialty) => (
            <div
              key={specialty}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
            >
              {specialty}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 rounded-full p-0 hover:bg-primary/20"
                onClick={() => removeSubSpecialty(specialty)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {specialty}</span>
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <Input
            value={newSubSpecialty}
            onChange={(e) => setNewSubSpecialty(e.target.value)}
            placeholder="Add a sub-specialty"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addSubSpecialty}
            disabled={!newSubSpecialty.trim()}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add sub-specialty</span>
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="yearsOfExperience">Years of Experience</Label>
        <Select
          value={formData.yearsOfExperience.toString()}
          onValueChange={handleYearsChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select years of experience" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 50 }, (_, i) => i + 1).map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year} {year === 1 ? "year" : "years"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Professional Associations</Label>
        <div className="flex flex-wrap gap-2">
          {formData.professionalAssociations.map((association) => (
            <div
              key={association}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
            >
              {association}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 rounded-full p-0 hover:bg-primary/20"
                onClick={() => removeAssociation(association)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {association}</span>
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <Input
            value={newAssociation}
            onChange={(e) => setNewAssociation(e.target.value)}
            placeholder="Add a professional association"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addAssociation}
            disabled={!newAssociation.trim()}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add association</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
