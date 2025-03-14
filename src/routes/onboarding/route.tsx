import { createFileRoute, Outlet } from "@tanstack/react-router";
import SEOWrapper from "@/utils/helpers/seo-wrapper";
import { LogoBlue } from "@/components/icons";
import { ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingLayout,
});

function OnboardingLayout() {
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
        <div className="flex flex-1 lg:w-1/2 flex-col px-12">
          <div className="flex-1 mx-auto w-full px-24 py-12">
            <div className=" mb-8 ">
              <LogoBlue />
            </div>

            <div className="flex items-center gap-x-3">
              <ArrowLeft />
              <Progress value={33} className="w-[300px]" />
            </div>

            {/* Outlet for nested routes (forms) */}
            <Outlet />
          </div>
        </div>
      </div>
    </SEOWrapper>
  );
}
