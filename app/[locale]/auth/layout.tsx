"use server";

import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="relative w-full grow bg-muted flex flex-col items-center justify-center">
      <Card className="relative w-full max-w-md">{children}</Card>
    </main>
  );
}
