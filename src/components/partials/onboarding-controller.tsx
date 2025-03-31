// import { useEffect } from "react";
// import { useNavigate, useRouterState } from "@tanstack/react-router";
// import {
//   useFormStore,
//   OnboardingStep,
//   stepToRouteMap,
//   routeToInitialStepMap,
// } from "@/store/form-store";
// import MultiStepForm from "./multi-step-form";

// export default function OnboardingController() {
//   const { currentStep } = useFormStore();
//   const navigate = useNavigate();
//   const routerState = useRouterState();
//   const currentRoute = routerState.location.pathname;

//   // Special case for completion step
//   const isCompletionStep = currentStep === OnboardingStep.COMPLETION;
//   const isCompletionRoute = currentRoute === "/onboarding/completion";

//   useEffect(() => {
//     // If the current route doesn't match the expected route for the current step, navigate to the correct route
//     const expectedRoute = stepToRouteMap[currentStep as OnboardingStep];
//     if (expectedRoute && currentRoute !== expectedRoute) {
//       navigate(expectedRoute);
//     }
//   }, [currentStep, currentRoute, navigate]);

//   return <MultiStepForm />;
// }
