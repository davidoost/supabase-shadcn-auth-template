"use server";

import { Card } from "@/components/ui/card";
import { Triangle } from "lucide-react";
import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="w-full min-h-dvh bg-muted flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <Triangle className="size-3" />
        </div>
        ACME
      </div>
      <Card className="w-full max-w-md">{children}</Card>
    </main>
  );
}
