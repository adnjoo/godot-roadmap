"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import glossaryDataRaw from "@/data/godot-glossary.json";

interface GlossaryTerm {
  term: string;
  definition: string;
  badges?: string[];
}

interface GlossaryCategory {
  id: string;
  title: string;
  terms: GlossaryTerm[];
}

interface GlossaryData {
  version: string;
  description: string;
  categories: GlossaryCategory[];
}

const glossaryData = glossaryDataRaw as GlossaryData;

export default function GlossaryPage() {
  const [filterGodot, setFilterGodot] = useState(true);
  const [filterUniversal, setFilterUniversal] = useState(true);

  const shouldShowTerm = (term: GlossaryTerm): boolean => {
    if (!term.badges || term.badges.length === 0) {
      return true; // Show terms without badges by default
    }
    return term.badges.some(
      (badge) =>
        (badge === "godot" && filterGodot) ||
        (badge === "universal" && filterUniversal)
    );
  };

  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Godot Glossary</h1>
        <p className="text-muted-foreground mb-2">{glossaryData.description}</p>
        <p className="text-sm text-muted-foreground">Version: {glossaryData.version}</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>🟦 Godot = engine-specific</p>
              <p>🟩 Universal = cross-engine</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-godot"
                  checked={filterGodot}
                  onCheckedChange={(checked) =>
                    setFilterGodot(checked === true)
                  }
                  aria-label="Filter Godot terms"
                />
                <label
                  htmlFor="filter-godot"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Godot terms
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-universal"
                  checked={filterUniversal}
                  onCheckedChange={(checked) =>
                    setFilterUniversal(checked === true)
                  }
                  aria-label="Filter Universal terms"
                />
                <label
                  htmlFor="filter-universal"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Universal terms
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion type="multiple" className="space-y-6" defaultValue={[]}>
        {glossaryData.categories.map((category) => (
          <AccordionItem key={category.id} value={category.id} className="border rounded-lg px-4">
            <AccordionTrigger className="text-xl font-semibold hover:no-underline">
              {category.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {category.terms
                  .filter(shouldShowTerm)
                  .map((term, index) => (
                    <div
                      key={index}
                      className="pb-4 border-b last:border-b-0 last:pb-0 transition-opacity duration-200"
                    >
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-base">{term.term}</h3>
                        {term.badges?.map((badge) => {
                          if (badge === "godot") {
                            return (
                              <Badge
                                key={badge}
                                className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 text-xs"
                              >
                                Godot
                              </Badge>
                            );
                          }
                          if (badge === "universal") {
                            return (
                              <Badge
                                key={badge}
                                className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20 text-xs"
                              >
                                Universal
                              </Badge>
                            );
                          }
                          return null;
                        })}
                      </div>
                      <p className="text-sm text-muted-foreground">{term.definition}</p>
                    </div>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
