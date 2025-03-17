import React from "react";
import { Link } from "@tanstack/react-router";
import { ContactCard } from "../icons";
import { ChevronRight, Divide } from "lucide-react";

const IdItems = [
  {
    title: "National ID Card",
  },
  {
    title: "Driver's Licence",
  },
  {
    title: "Passport",
  },
];

export default function SelectIdVerificationForm() {
  return (
    <div className="w-full md:max-w-md mx-auto lg:max-w-3xl pt-4">
      <div className="mb-6">
        <h1 className="pb-2 leading-10 text-xl md:text-2xl lg:text-3xl font-bold pt-6 max-w-lg lg:max-w-md">
          Select your identity verification type
        </h1>

        <p className="font-normal text-base text-dim-grey xs:w-full sm:max-w-[50%] lg:max-w-sm">
          Make sure ID is legible. What type of ID do you want to use?
        </p>
      </div>

      <div>
        {IdItems.map((item) => {
          return (
            <div
              key={item.title}
              className="flex justify-between items-center h-14"
            >
              <div className="flex items-center gap-x-3">
                <ContactCard />
                <h2 className="text-night text-base font-normal">
                  {item.title}
                </h2>
              </div>

              <ChevronRight color="#707070" size={28} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
