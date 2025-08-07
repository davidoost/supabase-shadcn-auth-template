"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import FormField from "@/components/forms/form-field";

import { login } from "@/lib/auth";

import { Loader2 } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";

export default function LoginForm() {
  const [state, action, isLoading] = useActionState(login, {});

  const t = useTranslations("loginForm");

  return (
    <form action={action} className="flex flex-col gap-6">
      <FormField
        name="email"
        label={t("emailLabel")}
        placeholder={t("emailPlaceholder")}
        values={state?.fieldValues}
        errors={state?.errors}
      />

      <FormField
        name="password"
        label={t("passwordLabel")}
        placeholder={t("passwordPlaceholder")}
        type="password"
        values={state?.fieldValues}
        errors={state?.errors}
        forgotPassword
      />

      {state?.error && (
        <p className="text-sm text-destructive">{state?.error}</p>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            {t("buttonLabelPending")}
          </>
        ) : (
          t("buttonLabel")
        )}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        {t("footerText")}{" "}
        <Link href="/auth/signup" className="underline underline-offset-4">
          {t("footerLinkText")}
        </Link>
      </p>
    </form>
  );
}
