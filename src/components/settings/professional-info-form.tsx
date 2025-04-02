import type React from "react";
import { useState, useEffect } from "react";
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
    specialty: string;
    yearsOfExperience: number | string;
    professionalAssociations: string;
  };
}

export default function ProfessionalInfoForm({
  initialData,
}: ProfessionalInfoFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [newAssociation, setNewAssociation] = useState("");

  // Ensure specialty is in the list of specialties, or add it if not
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
    "Endocrinology",
  ];

  // Make sure the specialty from backend is included in the list
  useEffect(() => {
    if (formData.specialty && !specialties.includes(formData.specialty)) {
      // If the backend specialty isn't in our list, add it
      specialties.push(formData.specialty);
    }
  }, [formData.specialty, specialties]);

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
      yearsOfExperience: value,
    }));
  };

  const addAssociation = (association: string) => {
    if (
      association.trim() &&
      !formData.professionalAssociations.split(",").includes(association.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        professionalAssociations: prev.professionalAssociations
          ? [
              ...prev.professionalAssociations.split(","),
              association.trim(),
            ].join(",")
          : association.trim(),
      }));
      setNewAssociation("");
    }
  };

  const removeAssociation = (association: string) => {
    setFormData((prev) => ({
      ...prev,
      professionalAssociations: prev.professionalAssociations
        .split(",")
        .filter((a) => a !== association)
        .join(","),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would submit the data to your API
    toast("Professional information updated");
  };

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
        <Label htmlFor="specialty">Primary Specialty</Label>
        <Select
          value={formData.specialty}
          onValueChange={(value) => handleSelectChange("specialty", value)}
        >
          <SelectTrigger className="capitalize">
            <SelectValue placeholder="Please choose a specialty">
              {formData.specialty}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {specialties.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                <div className="flex items-center justify-between w-full">
                  <span>{specialty}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="yearsOfExperience">Years of Experience</Label>
        <Select
          value={formData.yearsOfExperience.toString()}
          onValueChange={handleYearsChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select years of experience">
              {formData.yearsOfExperience}{" "}
              {Number(formData.yearsOfExperience) === 1 ? "year" : "years"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 50 }, (_, i) => i + 1).map((year) => (
              <SelectItem key={year} value={year.toString()}>
                <div className="flex items-center justify-between w-full">
                  <span>
                    {year} {year === 1 ? "year" : "years"}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Professional Associations</Label>
        <div className="flex flex-wrap gap-2">
          {formData.professionalAssociations &&
            formData.professionalAssociations
              .split(",")
              .filter(Boolean)
              .map((association) => (
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
            onClick={() => addAssociation(newAssociation)}
            disabled={!newAssociation.trim()}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add association</span>
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Save Changes
      </Button>
    </form>
  );
}
