"use client";

import { logout } from "@/lib/auth";
import { Button } from "../ui/button";
import { useActionState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LogoutButton() {
  const [_state, action, isLoading] = useActionState(logout, {});
  const t = useTranslations("userPage");
  return (
    <form action={action}>
      <Button
        type="submit"
        variant={"outline"}
        disabled={isLoading}
        className="text-destructive"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            {t("loggingOut")}
          </>
        ) : (
          <>
            <LogOut />
            {t("logout")}
          </>
        )}
      </Button>
    </form>
  );
}
