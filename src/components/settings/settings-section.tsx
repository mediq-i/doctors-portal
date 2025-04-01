import { type ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  onSave?: () => void;
}

export default function SettingsSection({
  title,
  description,
  children,
  defaultOpen = false,
}: SettingsSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="w-full">
      <CardHeader
        className="border-b bg-muted/50 px-4 py-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex w-full items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
        {description && (
          <CardDescription className="pt-1">{description}</CardDescription>
        )}
      </CardHeader>

      {isOpen && (
        <>
          <CardContent className="px-4 py-4">{children}</CardContent>
        </>
      )}
    </Card>
  );
}
