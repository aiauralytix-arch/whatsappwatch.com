"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AllowlistSectionProps = {
  allowlistNumberInput: string;
  allowlistNumbers: string[];
  canEdit: boolean;
  isSyncing: boolean;
  onAllowlistInputChange: (value: string) => void;
  onAddAllowlistNumbers: () => void;
  onRemoveAllowlistNumber: (number: string) => void;
};

export default function AllowlistSection({
  allowlistNumberInput,
  allowlistNumbers,
  canEdit,
  isSyncing,
  onAllowlistInputChange,
  onAddAllowlistNumbers,
  onRemoveAllowlistNumber,
}: AllowlistSectionProps) {
  return (
    <section>
      <Card className="bg-[#fefcf9]">
        <CardHeader>
          <CardTitle>Allowlist</CardTitle>
          <CardDescription>
            Messages from these numbers will never be auto-deleted, even if they
            are not group admins.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Add allowlisted numbers (comma separated, include country code)"
              value={allowlistNumberInput}
              onChange={(event) => onAllowlistInputChange(event.target.value)}
              disabled={!canEdit || isSyncing}
            />
            <Button
              variant="outline"
              className="whitespace-nowrap"
              onClick={onAddAllowlistNumbers}
              disabled={!canEdit || isSyncing}
            >
              Add to allowlist
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allowlistNumbers.length === 0 ? (
              <p className="text-sm text-[#6b6b6b]">
                No allowlisted numbers added yet.
              </p>
            ) : (
              allowlistNumbers.map((number) => (
                <Badge key={number} variant="soft" className="gap-2 pr-1">
                  <span>{number}</span>
                  <button
                    type="button"
                    className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#fefcf9] text-[10px] font-medium leading-none text-[#6b6b6b] ring-1 ring-[#d5cec3] transition hover:bg-[#161616] hover:text-[#f6f3ee] normal-case tracking-normal"
                    onClick={() => onRemoveAllowlistNumber(number)}
                    aria-label="Remove allowlisted number"
                    disabled={!canEdit || isSyncing}
                  >
                    x
                  </button>
                </Badge>
              ))
            )}
          </div>
          <p className="text-sm text-[#6b6b6b]">
            Use full numbers with country codes for reliable matching.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
