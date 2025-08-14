"use server";

import { Link } from "@/lib/i18n/navigation";
import { Button } from "../ui/button";
import LocaleSwitcher from "./locale-switcher";
import ThemeSwitcher from "./theme-switcher";
import { getCurrentUser } from "@/lib/auth";
import { ArrowRight } from "lucide-react";
import { use } from "react";
import { getTranslations } from "next-intl/server";

export default async function NavBar() {
  const t = await getTranslations("navBar");
  const userRes = use(getCurrentUser());

  return (
    <div className="w-full h-16 p-4 flex justify-end items-center">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-muted-foreground">
          <p>{t("tryItOut")}</p>
          <ArrowRight className="size-3" />
        </div>

        {userRes.success ? (
          <Button size={"sm"} variant={"outline"} asChild>
            <Link href="/profile">{t("profile")}</Link>
          </Button>
        ) : (
          <Button size={"sm"} variant={"outline"} asChild>
            <Link href="/auth/login">{t("logIn")}</Link>
          </Button>
        )}
        <LocaleSwitcher />
        <ThemeSwitcher />
      </div>
    </div>
  );
}
