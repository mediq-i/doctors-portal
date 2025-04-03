import { ContactCard } from "@/components/icons";
import { ChevronRight } from "lucide-react";
import useDoctorOnboardingStore from "@/store/doctor-onboarding-store";

const IdItems = [
  { title: "National ID Card", value: "national_id" },
  { title: "Driver's Licence", value: "drivers_license" },
  { title: "Passport", value: "passport" },
];

export function SelectIdVerificationForm() {
  const { updateFormStep, updateDocumentInfo } = useDoctorOnboardingStore();

  const handleSelectId = (idType: string) => {
    // Update the identification type in the store
    updateDocumentInfo("identification_type", idType);
    // Move to next step
    updateFormStep(4);
  };

  return (
    <div className="w-full md:max-w-md mx-auto lg:max-w-3xl pt-4">
      <div className="mb-6">
        <h1 className="pb-2 leading-8 lg:leading-10 text-xl md:text-2xl lg:text-3xl font-bold pt-6 max-w-lg lg:max-w-md">
          Select your identity verification type
        </h1>

        <p className="font-normal text-base text-dim-grey xs:w-full sm:max-w-[50%] lg:max-w-sm">
          Make sure ID is legible. What type of ID do you want to use?
        </p>
      </div>

      <div>
        {IdItems.map((item) => (
          <div
            key={item.value}
            className="flex justify-between items-center h-14 cursor-pointer hover:bg-gray-50 px-4 rounded-lg"
            onClick={() => handleSelectId(item.value)}
          >
            <div className="flex items-center gap-x-3">
              <ContactCard />
              <h2 className="text-night text-base font-normal">{item.title}</h2>
            </div>
            <ChevronRight color="#707070" size={28} />
          </div>
        ))}
      </div>
    </div>
  );
}
