"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type KeywordSectionProps = {
  keywordInput: string;
  keywords: string[];
  canEdit: boolean;
  isSyncing: boolean;
  onKeywordInputChange: (value: string) => void;
  onAddKeywords: () => void;
};

export default function KeywordSection({
  keywordInput,
  keywords,
  canEdit,
  isSyncing,
  onKeywordInputChange,
  onAddKeywords,
}: KeywordSectionProps) {
  return (
    <section>
      <Card className="bg-[#fefcf9]">
        <CardHeader>
          <CardTitle>Keyword Configuration</CardTitle>
          <CardDescription>
            Add terms that should be auto-deleted from the group.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Add blocked keywords (comma separated)"
              value={keywordInput}
              onChange={(event) => onKeywordInputChange(event.target.value)}
              disabled={!canEdit || isSyncing}
            />
            <Button
              variant="outline"
              className="whitespace-nowrap"
              onClick={onAddKeywords}
              disabled={!canEdit || isSyncing}
            >
              Add Keywords
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge key={keyword} variant="soft">
                {keyword}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-[#6b6b6b]">
            Messages containing these words will be auto-deleted.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
