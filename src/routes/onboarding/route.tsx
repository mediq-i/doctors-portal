import { createFileRoute, Outlet } from "@tanstack/react-router";
import SEOWrapper from "@/utils/helpers/seo-wrapper";
import { LogoBlue } from "@/components/icons";
import { ArrowLeft } from "lucide-react";
// import { Progress } from "@/components/ui/progress";
import { ProgressBar } from "@/components/partials/progress-bar";
import { OnboardingStep } from "@/store/form-store";
import { useOnboardingProgressStore } from "@/store/onboarding-progress";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingLayout,
});

function OnboardingLayout() {
  //Get the currentStep and total steps from the store
  const { currentStep, totalSteps } = useOnboardingProgressStore();
  const isLastStep = currentStep === OnboardingStep.COMPLETION;

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
                <ArrowLeft />
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

{
  /* <Progress
                value={progressPercentage}
                className="w-[350px] md:w-[400px] h-1.5"
              /> */
}
