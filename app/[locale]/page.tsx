"use server";

import { Button } from "@/components/ui/button";
import { Code, Play } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("homePage");

  return (
    <main className="w-full flex flex-col items-center p-8 py-16">
      <div className="w-full flex flex-col max-w-2xl gap-4">
        <h1 className="text-4xl font-bold">
          {t.rich("title", {
            i: (chunks) => <i className="text-yellow-500">{chunks}</i>,
          })}
        </h1>

        <p>{t("description")}</p>

        <ul className="list-disc ml-6">
          <li>{t("supabase")}</li>
          <li>{t("shadcn")}</li>
          <li>{t("next-intl")}</li>
          <li>{t("next-themes")}</li>
        </ul>
        <p>{t("cta")}</p>
        <div className="flex gap-2">
          <Button className="font-mono">
            <Play />
            {t("buttonText")}
          </Button>
          <Button className="font-mono" variant={"outline"}>
            <Code />
            readme.md
          </Button>
        </div>
      </div>
    </main>
  );
}
