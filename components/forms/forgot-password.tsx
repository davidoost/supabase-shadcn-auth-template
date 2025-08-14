"use client";

import FormField from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "@/lib/passwords";
import { useActionState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslations } from "next-intl";
import { Input } from "../ui/input";

export default function ForgotPasswordForm() {
  const [state, action, isLoading] = useActionState(requestPasswordReset, {});

  const t = useTranslations("forgotPasswordForm");

  return (
    <form action={action} className="flex flex-col gap-6">
      <FormField
        name="email"
        label={t("emailLabel")}
        placeholder={t("emailPlaceholder")}
        values={state?.fieldValues}
        errors={state?.errors}
      />

      <Input name="redirect" className="hidden" />

      {state?.error && (
        <p className="text-sm text-destructive">{state?.error}</p>
      )}

      <Button type="submit" isLoading={isLoading}>
        {t("buttonLabel")}
      </Button>

      {state?.success && (
        <Alert className="text-green-600">
          <AlertTitle>{t("successLabel")}</AlertTitle>
          <AlertDescription>{t("successText")}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
