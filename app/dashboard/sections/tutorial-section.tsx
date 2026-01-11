"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TutorialSection() {
  return (
    <section>
      <Card className="bg-[#fefcf9]">
        <CardHeader>
          <CardTitle>Watch: How to set up WhatsApp moderation in 2 minutes</CardTitle>
          <CardDescription>
            A short walkthrough to get your group protected quickly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full overflow-hidden rounded-3xl border border-[#e2dad0] bg-[#efe9df]">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/ysz5S6PUM-U"
              title="WhatsApp moderation tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
