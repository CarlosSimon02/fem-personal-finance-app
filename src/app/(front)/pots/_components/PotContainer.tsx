"use client";

import { Suspense } from "react";
import { usePotPageParams } from "../_hooks/usePotPageParams";
import { usePotPageRealtime } from "../_hooks/usePotPageRealtime";
import { PotsGrid } from "./PotsGrid";
import { PotsSkeleton } from "./PotsSkeleton";

const PotContainer = () => {
  const { page, pageSize } = usePotPageParams();

  usePotPageRealtime({
    page,
    pageSize,
  });

  return (
    <Suspense fallback={<PotsSkeleton />}>
      <PotsGrid page={page} pageSize={pageSize} />
    </Suspense>
  );
};

export default PotContainer;
