"use client";

import { OrganizationList, useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Onboarding = () => {
  const { organization } = useOrganization();
  const router = useRouter();

  console.log("Onboarding Component Rendered");
  console.log("Current Organization:", organization);

  // useEffect(() => {
  //   if (organization) {
  //     console.log(
  //       "Organization detected, redirecting to:",
  //       `/organization/${organization.slug}`,
  //     );
  //     router.push(`/organization/${organization.slug}`);
  //   }
  // }, [organization]);

  return (
    <div className="flex justify-center items-center pt-14">
      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl="/organization/:slug"
        afterSelectOrganizationUrl="/organization/:slug"
      />
    </div>
  );
};

export default Onboarding;
