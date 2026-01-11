"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AdminAllowlistSectionProps = {
  adminNumberInput: string;
  adminNumbers: string[];
  canEdit: boolean;
  isSyncing: boolean;
  onAdminInputChange: (value: string) => void;
  onAddAdminNumbers: () => void;
  onRemoveAdminNumber: (number: string) => void;
};

export default function AdminAllowlistSection({
  adminNumberInput,
  adminNumbers,
  canEdit,
  isSyncing,
  onAdminInputChange,
  onAddAdminNumbers,
  onRemoveAdminNumber,
}: AdminAllowlistSectionProps) {
  return (
    <section>
      <Card className="bg-[#fefcf9]">
        <CardHeader>
          <CardTitle>Admin Allowlist</CardTitle>
          <CardDescription>
            Messages from these numbers will never be auto-deleted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Add admin numbers (comma separated, include country code)"
              value={adminNumberInput}
              onChange={(event) => onAdminInputChange(event.target.value)}
              disabled={!canEdit || isSyncing}
            />
            <Button
              variant="outline"
              className="whitespace-nowrap"
              onClick={onAddAdminNumbers}
              disabled={!canEdit || isSyncing}
            >
              Add Admins
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {adminNumbers.length === 0 ? (
              <p className="text-sm text-[#6b6b6b]">
                No admin numbers added yet.
              </p>
            ) : (
              adminNumbers.map((number) => (
                <Badge key={number} variant="soft" className="gap-2 pr-1">
                  <span>{number}</span>
                  <button
                    type="button"
                    className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#fefcf9] text-[10px] font-medium leading-none text-[#6b6b6b] ring-1 ring-[#d5cec3] transition hover:bg-[#161616] hover:text-[#f6f3ee] normal-case tracking-normal"
                    onClick={() => onRemoveAdminNumber(number)}
                    aria-label="Remove admin number"
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
