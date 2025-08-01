"use client";

import { Locale, useLocale, useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ComponentType } from "react";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { NL, US } from "country-flag-icons/react/1x1";

const localeToFlag: Record<Locale, ComponentType<{ className?: string }>> = {
  nl: NL,
  en: US,
};

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const FlagIcon = localeToFlag[locale];
  const t = useTranslations("languages");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"outline"} className="size-8">
          <FlagIcon className="rounded-xs size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4">
        {routing.locales.map((loc) => {
          const ItemFlag = localeToFlag[loc];
          return (
            <DropdownMenuItem
              key={loc}
              onClick={() => router.replace(pathname, { locale: loc })}
            >
              <ItemFlag className="rounded-xs size-4" />
              {t(loc)}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
