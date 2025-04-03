import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    redirect({
      to: "/dashboard",
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div></div>;
}
