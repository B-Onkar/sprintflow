"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { useEffect } from "react";

const OrgActivator = ({ orgId }) => {
  const { setActive, isLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  useEffect(() => {
    if (isLoaded && setActive && orgId) {
      setActive({ organization: orgId });
    }
  }, [isLoaded, setActive, orgId]);

  return null;
};

export default OrgActivator;
