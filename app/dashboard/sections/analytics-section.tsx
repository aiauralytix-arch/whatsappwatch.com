"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Messages scanned today", value: "2,184" },
  { label: "Messages deleted", value: "128" },
  { label: "Spam messages detected", value: "46" },
  { label: "Most common spam type", value: "Promo links" },
];

export default function AnalyticsSection() {
  return (
    <section>
      <Card className="bg-[#fefcf9]">
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
          <CardDescription>
            A quick readout of moderation activity today.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#e2dad0] bg-white px-5 py-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[#9a948b]">
                {stat.label}
              </p>
              <p className="mt-3 text-xl font-semibold text-[#161616]">
                {stat.value}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
