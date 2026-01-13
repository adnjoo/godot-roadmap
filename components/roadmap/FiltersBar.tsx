"use client";

import { useState, useEffect, useMemo } from "react";
import { useRoadmap, Difficulty, Category } from "@/lib/store/RoadmapContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface FiltersBarProps {
  filters: ReturnType<typeof useRoadmap>["filters"];
  onFiltersChange: (filters: Partial<ReturnType<typeof useRoadmap>["filters"]>) => void;
  activeFilterCount: number;
}

export function FiltersBar({ filters, onFiltersChange, activeFilterCount }: FiltersBarProps) {
  const [searchValue, setSearchValue] = useState(filters.search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFiltersChange({ search: searchValue });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, filters.search, onFiltersChange]);

  const difficulties: (Difficulty | "All")[] = ["All", "Beginner", "Intermediate", "Advanced"];
  const categories: (Category | "All")[] = ["All", "2D", "3D", "UI", "Systems", "Tools"];

  const handleClearFilters = () => {
    setSearchValue("");
    onFiltersChange({
      difficulty: "All",
      category: "All",
      showOnlyRemaining: false,
      search: "",
    });
  };

  return (
    <div
      className={cn(
        "sticky top-28 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "transition-all duration-200"
      )}
    >
      <div className="container py-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-9"
              aria-label="Search roadmap items"
            />
          </div>

          {/* Difficulty Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground hidden md:inline">Difficulty:</span>
            {difficulties.map((diff) => (
              <Button
                key={diff}
                variant={filters.difficulty === diff ? "default" : "outline"}
                size="sm"
                onClick={() => onFiltersChange({ difficulty: diff })}
                aria-pressed={filters.difficulty === diff}
              >
                {diff}
              </Button>
            ))}
          </div>

          {/* Category Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground hidden md:inline">Category:</span>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={filters.category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => onFiltersChange({ category: cat })}
                aria-pressed={filters.category === cat}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Show Only Remaining Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showOnlyRemaining"
              checked={filters.showOnlyRemaining}
              onCheckedChange={(checked) =>
                onFiltersChange({ showOnlyRemaining: checked === true })
              }
            />
            <label
              htmlFor="showOnlyRemaining"
              className="text-sm font-medium cursor-pointer whitespace-nowrap"
            >
              Remaining only
            </label>
          </div>

          {/* Clear Filters Button */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="whitespace-nowrap"
              aria-label="Clear all filters"
            >
              <X className="h-4 w-4 mr-2" />
              Clear
              {activeFilterCount > 1 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
