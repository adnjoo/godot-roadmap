import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import glossaryDataRaw from "@/data/godot-glossary.json";

interface GlossaryTerm {
  term: string;
  definition: string;
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

  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Godot Glossary</h1>
        <p className="text-muted-foreground mb-2">{glossaryData.description}</p>
        <p className="text-sm text-muted-foreground">Version: {glossaryData.version}</p>
      </div>

      <div className="space-y-6">
        {glossaryData.categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="text-xl">{category.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.terms.map((term, index) => (
                  <div
                    key={index}
                    className="pb-4 border-b last:border-b-0 last:pb-0"
                  >
                    <h3 className="font-semibold text-base mb-1">{term.term}</h3>
                    <p className="text-sm text-muted-foreground">{term.definition}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
