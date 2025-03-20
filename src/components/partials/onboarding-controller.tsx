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

  // Special case for completion step
  const isCompletionStep = currentStep === OnboardingStep.COMPLETION;
  const isCompletionRoute = currentRoute === "/onboarding/completion";

  useEffect(() => {
    // Skip route synchronization if we're on the completion step/route
    if (isCompletionStep && isCompletionRoute) {
      return;
    }

    // If we're on a route that doesn't match the current step, update the step
    const expectedRoute = stepToRouteMap[currentStep as OnboardingStep];

    if (expectedRoute && currentRoute !== expectedRoute) {
      // Check if the current route exists in the map
      if (Object.keys(routeToInitialStepMap).includes(currentRoute)) {
        const initialStep =
          routeToInitialStepMap[
            currentRoute as keyof typeof routeToInitialStepMap
          ];
        if (initialStep) {
          goToStep(initialStep);
        }
      } else {
        console.warn(`Route not found in map: ${currentRoute}`);
        // Fallback to a default step if needed
        goToStep(OnboardingStep.CREATE_ACCOUNT);
      }
    }
  }, [
    currentRoute,
    currentStep,
    goToStep,
    isCompletionStep,
    isCompletionRoute,
  ]);

  // Navigate to the appropriate route when the step changes
  useEffect(() => {
    const targetRoute = stepToRouteMap[currentStep as OnboardingStep];

    if (targetRoute && currentRoute !== targetRoute) {
      navigate({ to: targetRoute });
    }
  }, [currentStep, navigate, currentRoute]);

  return <MultiStepForm />;
}
