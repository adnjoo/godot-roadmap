"use client";

import { useState, useEffect } from "react";
import { RadialTree } from "@/components/gym/RadialTree";
import { GymFilters, type GymFilters as GymFiltersType } from "@/components/gym/GymFilters";
import { GymLegend } from "@/components/gym/GymLegend";

export default function GymPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [filters, setFilters] = useState<GymFiltersType>({
    tiers: new Set([1, 2, 3, 4, 5]),
    category: null,
    showCompletedOnly: false,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden" style={{ marginTop: 0, marginBottom: 0 }}>
      <RadialTree filters={filters} isMobile={isMobile} />
      <GymLegend />
      <GymFilters filters={filters} onFiltersChange={setFilters} />
    </div>
  );
}
