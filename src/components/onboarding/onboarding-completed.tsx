import { Button } from "@/components/ui/button";
import { AllSetIcon } from "../icons";
// import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

export default function OnboardingCompleted() {
  const navigate = useNavigate();
  const handleDashboardNavigation = () => {
    navigate({ to: "/dashboard" });
  };

  return (
    <section className="w-full mx-auto pt-8 text-center  lg:max-w-3xl">
      <div className="flex flex-col items-center mb-10">
        <AllSetIcon />
        <h1 className="pb-3 leading-8 lg:leading-10 text-3xl font-bold">
          You're All Set!
        </h1>
        <p className="pb-4 text-base font-medium text-[#707070]">
          Your submission is under review, but you can now explore the
          dashboard. We'll notify you once your verification is complete.
        </p>
      </div>

      {/* <Link to="/dashboard"> */}
      <Button
        onClick={handleDashboardNavigation}
        className="w-full text-center text-base bg-primary border text-white py-6 rounded-lg transition-all duration-600 hover:text-neutral-50 hover:shadow-md"
      >
        Proceed to dashboard
      </Button>
      {/* </Link> */}
    </section>
  );
}
