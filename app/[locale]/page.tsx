"use server";

import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
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
          <Button className="font-mono" asChild>
            <Link href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdavidoost%2Fsupabase-shadcn-auth-template&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&demo-title=Demo&demo-url=https%3A%2F%2Fsupabase-shadcn-auth-template.vercel.app">
              <Play />
              {t("buttonText")}
            </Link>
          </Button>
          <Button className="font-mono" variant={"outline"} asChild>
            <Link href="https://github.com/davidoost/supabase-shadcn-auth-template">
              <Code />
              readme.md
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
