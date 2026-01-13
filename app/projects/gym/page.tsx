"use client";

import { useState, useEffect } from "react";
import { GymFlow } from "@/components/gym/GymFlow";
import { GymFilters, type GymFilters as GymFiltersType } from "@/components/gym/GymFilters";
import { NodeDetailsPanel } from "@/components/gym/NodeDetailsPanel";
import { gymNodes } from "@/data/godotGym";

export default function GymPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  const selectedNode = selectedNodeId ? gymNodes.find((n) => n.id === selectedNodeId) : null;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-40" style={{ marginTop: 0, marginBottom: 0 }}>
      <GymFlow
        filters={filters}
        searchQuery={searchQuery}
        selectedNodeId={selectedNodeId}
        onNodeSelect={setSelectedNodeId}
        isMobile={isMobile}
      />
      <GymFilters
        filters={filters}
        onFiltersChange={setFilters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <NodeDetailsPanel
        node={selectedNode ?? null}
        isOpen={selectedNode !== null}
        onClose={() => setSelectedNodeId(null)}
        isMobile={isMobile}
        onPrereqClick={(nodeId) => setSelectedNodeId(nodeId)}
      />
    </div>
  );
}
