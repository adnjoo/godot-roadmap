"use client";

import { useRoadmap, Difficulty, Category } from "@/lib/store/RoadmapContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

export function FilterBar() {
  const { filters, updateFilters } = useRoadmap();

  const difficulties: (Difficulty | "All")[] = ["All", "Beginner", "Intermediate", "Advanced"];
  const categories: (Category | "All")[] = ["All", "2D", "3D", "UI", "Systems", "Tools"];

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Search</label>
          <Input
            placeholder="Search items..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Difficulty</label>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((diff) => (
              <Button
                key={diff}
                variant={filters.difficulty === diff ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilters({ difficulty: diff })}
              >
                {diff}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={filters.category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilters({ category: cat })}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="showOnlyRemaining"
            checked={filters.showOnlyRemaining}
            onCheckedChange={(checked) => updateFilters({ showOnlyRemaining: checked === true })}
          />
          <label htmlFor="showOnlyRemaining" className="text-sm font-medium cursor-pointer">
            Show only remaining items
          </label>
        </div>

        {(filters.difficulty !== "All" ||
          filters.category !== "All" ||
          filters.showOnlyRemaining ||
          filters.search) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              updateFilters({
                difficulty: "All",
                category: "All",
                showOnlyRemaining: false,
                search: "",
              })
            }
            className="w-full"
          >
            <X className="h-4 w-4 mr-2" />
            Clear filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
