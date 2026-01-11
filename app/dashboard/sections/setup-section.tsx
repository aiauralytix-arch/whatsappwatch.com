"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SetupSection() {
  return (
    <section>
      <Card className="bg-[#fefcf9]">
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>
            Follow this guided flow to activate moderation in minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4 text-sm text-[#4b4b4b]">
              <div className="flex gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a948b]">
                  Step 1
                </span>
                <span>Add your WhatsApp group invite link and subscribe.</span>
              </div>
              <div className="flex gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a948b]">
                  Step 2
                </span>
                <span>Select the group you want to moderate.</span>
              </div>
              <div className="flex gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a948b]">
                  Step 3
                </span>
                <span>Enable moderation toggles below.</span>
              </div>
            </div>
            <div className="rounded-2xl border border-[#e2dad0] bg-white p-5 text-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-[#9a948b]">
                Sample details
              </p>
              <p className="mt-3 text-lg font-semibold text-[#161616]">
                +1 (415) 555-0123
              </p>
              <p className="mt-2 text-[#4b4b4b]">
                Group: <span className="font-medium">Community Alpha</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
