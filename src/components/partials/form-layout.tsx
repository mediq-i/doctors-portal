import type { ReactNode } from "react";
import { ProgressBar } from "./progress-bar";

interface FormLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
}

export function FormLayout({
  children,
  currentStep,
  totalSteps,
  title,
}: FormLayoutProps) {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      {children}
    </div>
  );
}
