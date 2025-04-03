import { ReactNode, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
}
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");

    if (!authToken || !userId) {
      navigate({ to: "/auth/login" });
    }

    try {
      const tokenData = JSON.parse(atob(authToken!.split(".")[1]));
      if (tokenData.exp * 1000 < Date.now()) {
        toast.error("Session expired. Please login again");
        localStorage.clear();
        navigate({ to: "/auth/login" });
      }
    } catch (error) {
      console.log(error);
      localStorage.clear();
      navigate({ to: "/auth/login" });
    }
  }, [navigate]);

  return <>{children}</>;
}
