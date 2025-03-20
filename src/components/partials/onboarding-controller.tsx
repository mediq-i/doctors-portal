// components/partials/onboarding-controller.tsx
import { useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  useFormStore,
  OnboardingStep,
  stepToRouteMap,
  routeToInitialStepMap,
} from "@/store/form-store";
import MultiStepForm from "./multi-step-form";

export default function OnboardingController() {
  const { currentStep, goToStep } = useFormStore();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentRoute = routerState.location.pathname;

  // Synchronize the current route with the form step
  useEffect(() => {
    // If we're on a route that doesn't match the current step, update the step
    const expectedRoute = stepToRouteMap[currentStep];
    if (expectedRoute && currentRoute !== expectedRoute) {
      // If we're on a different route, set the step to the initial step for this route
      const initialStep =
        routeToInitialStepMap["/onboarding/personal-professional-information"];
      if (initialStep) {
        goToStep(initialStep);
      }
    }
  }, [currentRoute, currentStep, goToStep]);

  // Navigate to the appropriate route when the step changes
  useEffect(() => {
    const targetRoute = stepToRouteMap[currentStep];
    if (targetRoute && currentRoute !== targetRoute) {
      navigate({ to: targetRoute });
    }
  }, [currentStep, navigate, currentRoute]);

  return <MultiStepForm />;
}
