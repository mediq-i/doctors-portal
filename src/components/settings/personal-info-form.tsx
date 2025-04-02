import type React from "react";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ServiceProviderAdapter,
  useUserMutation,
} from "@/adapters/ServiceProviders";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

interface PersonalInfoFormProps {
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    bio: string;
    languages: string;
    dob: string;
  };
}

export default function PersonalInfoForm({
  initialData,
}: PersonalInfoFormProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialData);

  // Calculate max date (today) and min date (120 years ago)
  const [dateConstraints, setDateConstraints] = useState({
    max: "",
    min: "",
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 120);
    const minDateString = minDate.toISOString().split("T")[0];

    setDateConstraints({
      max: today,
      min: minDateString,
    });
  }, []);

  const { mutateAsync, isPending } = useUserMutation({
    mutationCallback: ServiceProviderAdapter.updateServiceProvider,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create FormData for the update
      const formDataToSend = new FormData();

      // Add all form fields to FormData
      formDataToSend.append("first_name", formData.firstName);
      formDataToSend.append("last_name", formData.lastName);
      formDataToSend.append("bio", formData.bio || "");
      formDataToSend.append("languages", formData.languages);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("dob", formData.dob); // Add date of birth

      await mutateAsync(formDataToSend);
      queryClient.invalidateQueries({ queryKey: ["provider"] });
      toast.success("Personal information updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update personal information");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            max={dateConstraints.max}
            min={dateConstraints.min}
            required
            className="py-5"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Gender</Label>
        <RadioGroup
          value={formData.gender}
          onValueChange={handleGenderChange}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">Other</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="languages">Languages</Label>
        <Input
          id="languages"
          name="languages"
          value={formData.languages}
          onChange={handleChange}
          placeholder="Enter languages separated by commas"
          required
        />
        <p className="text-sm text-muted-foreground">
          Enter all languages you speak, separated by commas (e.g., English,
          French, Yoruba)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Professional Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          placeholder="Tell patients about yourself, your background, and your approach to care"
        />
      </div>

      <Button type="submit" className="w-max" disabled={isPending}>
        {isPending ? "Updating..." : "Save Changes"}
      </Button>
    </form>
  );
}
