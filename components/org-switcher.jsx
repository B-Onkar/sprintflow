"use client";

import { OrganizationSwitcher, SignedIn, useOrganization, useUser} from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const OrgSwitcher = () => {
    const { isLoaded } = useOrganization();
    const { isLoaded: isUserLoaded } = useUser();
    const pathname = usePathname();

    if (pathname === "/") {
        return null;
    }

    if (!isLoaded || !isUserLoaded) {
        return null;
    }

    return (
    <div className="flex justify-end mt-1">
        <SignedIn>
            <OrganizationSwitcher
                hidePersonal
                afterCreateOrganizationUrl="/organization/:slug"
                afterSelectOrganizationUrl="/organization/:slug"
                createOrganizationMode={
                    pathname === "/onboarding" ? "navigation" : "modal"
                }
                createOrganizationUrl="/onboarding"
                appearance={{
                    elements: {
                        organizationSwitcherTrigger:
                            "border border-gray-300 rounded-md px-5 py-2",
                        organizationSwitcherTriggerIcon: "text-white",
                    },
                }}
            />
        </SignedIn>
    </div>
  );
}

export default OrgSwitcher;