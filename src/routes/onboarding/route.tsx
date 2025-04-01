import { createFileRoute, Outlet } from "@tanstack/react-router";
import SEOWrapper from "@/utils/helpers/seo-wrapper";
import { LogoBlue } from "@/components/icons";
import { ArrowLeft } from "lucide-react";
import { ProgressBar } from "@/components/partials/progress-bar";
import { useOnboardingProgressStore } from "@/store/onboarding-progress";
// import { usePersonalProfessionalInfoStore } from "@/store/personal-professional-info-store";
import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingLayout,
});

function OnboardingLayout() {
  const location = useLocation();
  const setStep = useOnboardingProgressStore((state) => state.setStep);
  //Get the currentStep and total steps from the store
  const { currentStep, totalSteps, goToPreviousStep } =
    useOnboardingProgressStore();
  // const isLastStep = currentStep === OnboardingStep.COMPLETION;
  const isLastStep = currentStep === 10;

  useEffect(() => {
    if (location.pathname === "/onboarding/create-account") {
      setStep(1); // Set step to 1 when navigating to this route
    }
    if (location.pathname === "/onboarding/personal-professional-information") {
      setStep(4); // Set step to 4 when navigating to this route
    }
  }, [location.pathname, setStep]);

  return (
    <SEOWrapper
      metaData={{
        title: "",
        name: "",
        content: "",
      }}
    >
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        {/* Left side - Marketing content (hidden on mobile/tablet) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col relative">
          <div className="h-[500px]">
            <img
              src="/images/onboarding-img.png"
              alt="doctor's image"
              className="w-full object-cover"
            />
          </div>

          <div className="flex flex-col h-full bg-gunmetal py-8 px-6 max-w-4xl">
            <h1 className="text-3xl font-semibold mb-4 text-white">
              Optimize your healthcare operations with our intelligent medical
              admin dashboard
            </h1>
            <p className="text-white/80 mb-6 font-medium text-sm max-w-2xl">
              This comprehensive digital solution centralizes and streamlines
              essential tasks, data, and processes, empowering healthcare
              providers to deliver better patient care and enhance operational
              efficiency.
            </p>
          </div>
        </div>

        {/* Right side - Form content */}
        <div className="flex flex-1 w-full md:max-w-3xl mx-auto lg:w-1/2 sm:px-0 md:px-12">
          <div className="flex-1 mx-auto w-full px-4 md:px-8 py-6 lg:py-12">
            <div className=" mb-8 ">
              <LogoBlue />
            </div>

            {!isLastStep && (
              <div className="flex items-center gap-x-5">
                <ArrowLeft
                  onClick={currentStep >= 5 ? goToPreviousStep : undefined}
                  className={
                    currentStep < 5
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }
                />{" "}
                <ProgressBar
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                />
              </div>
            )}

            {/* Outlet for nested routes (forms) */}
            <Outlet />
          </div>
        </div>
      </div>
    </SEOWrapper>
  );
}
