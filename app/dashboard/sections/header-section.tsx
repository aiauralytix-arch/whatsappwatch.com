"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type HeaderSectionProps = {
  userName: string;
  userEmail: string;
};

export default function HeaderSection({ userName, userEmail }: HeaderSectionProps) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#6b6b6b]">
            Admin Control Panel
          </p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
            WhatsApp Moderation Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#4b4b4b]">
            Control how messages are moderated across your WhatsApp groups.
          </p>
        </div>
        <Card className="w-full max-w-sm bg-[#fefcf9] p-6 sm:w-auto">
          <CardHeader className="pb-4">
            <CardDescription>Signed in as</CardDescription>
            <CardTitle className="text-lg">{userName}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-[#6b6b6b]">{userEmail}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
