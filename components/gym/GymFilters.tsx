"use client";

import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gymNodes } from "@/data/godotGym";
import { ChevronDown, Search, X } from "lucide-react";

export interface GymFilters {
  tiers: Set<number>;
  category: string | null;
  showCompletedOnly: boolean;
}

interface GymFiltersProps {
  filters: GymFilters;
  onFiltersChange: (filters: GymFilters) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function GymFilters({ filters, onFiltersChange, searchQuery, onSearchChange }: GymFiltersProps) {
  const categories = useMemo(() => {
    const cats = new Set(gymNodes.map((node) => node.category));
    return Array.from(cats).sort();
  }, []);

  const toggleTier = (tier: number) => {
    const newTiers = new Set(filters.tiers);
    if (newTiers.has(tier)) {
      newTiers.delete(tier);
    } else {
      newTiers.add(tier);
    }
    onFiltersChange({ ...filters, tiers: newTiers });
  };

  const setCategory = (category: string | null) => {
    onFiltersChange({ ...filters, category });
  };

  const toggleCompletedOnly = () => {
    onFiltersChange({ ...filters, showCompletedOnly: !filters.showCompletedOnly });
  };

  return (
    <div className="absolute top-24 right-4 z-10 bg-stone-900/90 backdrop-blur-sm border border-stone-700 rounded-lg p-4 space-y-3 w-64">
      <div className="text-sm font-semibold text-stone-200 mb-2">Filters</div>
      
      {/* Search box */}
      <div className="space-y-2">
        <div className="text-xs text-stone-400 mb-1">Search</div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 pr-8 h-8 text-xs bg-stone-800 border-stone-700 text-stone-200"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Tier checkboxes */}
      <div className="space-y-2">
        <div className="text-xs text-stone-400 mb-1">Tiers</div>
        {[1, 2, 3, 4, 5].map((tier) => (
          <div key={tier} className="flex items-center gap-2">
            <Checkbox
              id={`tier-${tier}`}
              checked={filters.tiers.has(tier)}
              onCheckedChange={() => toggleTier(tier)}
            />
            <label
              htmlFor={`tier-${tier}`}
              className="text-xs text-stone-300 cursor-pointer"
            >
              Tier {tier}
            </label>
          </div>
        ))}
      </div>

      {/* Category dropdown */}
      <div className="space-y-2">
        <div className="text-xs text-stone-400 mb-1">Category</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-between text-xs">
              {filters.category || "All Categories"}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setCategory(null)}>
              All Categories
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem key={category} onClick={() => setCategory(category)}>
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Show completed only */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="completed-only"
          checked={filters.showCompletedOnly}
          onCheckedChange={toggleCompletedOnly}
        />
        <label
          htmlFor="completed-only"
          className="text-xs text-stone-300 cursor-pointer"
        >
          Show completed only
        </label>
      </div>
    </div>
  );
}
