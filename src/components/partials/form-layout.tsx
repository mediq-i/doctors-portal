import type { ReactNode } from "react";

interface FormLayoutProps {
  children: ReactNode;
}

export function FormLayout({ children }: FormLayoutProps) {
  return <div className="w-full max-w-md p-6">{children}</div>;
}
