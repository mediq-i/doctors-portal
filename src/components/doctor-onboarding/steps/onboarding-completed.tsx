import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import useDoctorOnboardingStore from "@/store/doctor-onboarding-store";

export function OnboardingCompleted() {
  const navigate = useNavigate();
  const { resetStore } = useDoctorOnboardingStore();

  const handleDashboardNavigation = () => {
    resetStore(); // Clear the onboarding store data
    navigate({ to: "/dashboard" });
  };

  return (
    <section className="w-full mx-auto pt-8 text-center lg:max-w-3xl">
      <div className="flex flex-col items-center mb-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="pb-3 leading-8 lg:leading-10 text-3xl font-bold">
          You're All Set!
        </h1>
        <p className="pb-4 text-base font-medium text-[#707070] max-w-md">
          Your submission is under review, but you can now explore the
          dashboard. We'll notify you once your verification is complete.
        </p>
      </div>

      <Button
        onClick={handleDashboardNavigation}
        className="w-full text-center text-base bg-primary border text-white py-6 rounded-lg transition-all duration-600 hover:text-neutral-50 hover:shadow-md"
      >
        Proceed to dashboard
      </Button>
    </section>
  );
}
