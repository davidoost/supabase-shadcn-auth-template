"use client";

import FormField from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { signup } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslations } from "next-intl";

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, null);

  const t = useTranslations("signupForm");

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormField
        name="email"
        label={t("emailLabel")}
        placeholder={t("emailPlaceholder")}
        values={state?.values}
        errors={state?.errors}
      />

      <div className="flex gap-2">
        <FormField
          name="first_name"
          label={t("firstNameLabel")}
          placeholder={t("firstNamePlaceholder")}
          values={state?.values}
          errors={state?.errors}
        />

        <FormField
          name="last_name"
          label={t("lastNameLabel")}
          placeholder={t("lastNamePlaceholder")}
          values={state?.values}
          errors={state?.errors}
        />
      </div>

      <FormField
        name="password"
        label={t("passwordLabel")}
        placeholder={t("passwordPlaceholder")}
        type="password"
        values={state?.values}
        errors={state?.errors}
      />

      <FormField
        name="confirm_password"
        label={t("confirmPasswordLabel")}
        placeholder={t("confirmPasswordPlaceholder")}
        type="password"
        values={state?.values}
        errors={state?.errors}
      />

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            {t("buttonLabelPending")}
          </>
        ) : (
          t("buttonLabel")
        )}
      </Button>

      {state?.success && (
        <Alert className="text-green-600">
          <AlertTitle>{t("successLabel")}</AlertTitle>
          <AlertDescription>{t("successText")}</AlertDescription>
        </Alert>
      )}

      <p className="text-muted-foreground text-center text-sm">
        {t("footerText")}{" "}
        <Link href="/auth/login" className="underline underline-offset-4">
          {t("footerLinkText")}
        </Link>
      </p>
    </form>
  );
}
