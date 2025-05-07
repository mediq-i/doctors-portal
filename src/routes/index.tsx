import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    redirect({
      to: "/dashboard",
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/dashboard" });
  }, [navigate]);

  return <div></div>;
}
