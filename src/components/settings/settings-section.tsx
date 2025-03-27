import { CardFooter } from "@/components/ui/card";

import { type ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  onSave,
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
          {onSave && (
            <CardFooter className="border-t bg-muted/50 px-4 py-3">
              <Button onClick={onSave}>Save Changes</Button>
            </CardFooter>
          )}
        </>
      )}
    </Card>
  );
}
