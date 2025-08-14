"use client";

import FormField from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/lib/auth";
import { useActionState } from "react";
import { useTranslations } from "next-intl";

export default function ResetPasswordForm() {
  const [state, action, isLoading] = useActionState(resetPassword, {});

  const t = useTranslations("resetPasswordForm");

  return (
    <form action={action} className="flex flex-col gap-6">
      <FormField
        name="password"
        label={t("passwordLabel")}
        placeholder={t("passwordPlaceholder")}
        type="password"
        values={state?.fieldValues}
        errors={state?.errors}
      />

      <FormField
        name="confirm_password"
        label={t("confirmPasswordLabel")}
        placeholder={t("confirmPasswordPlaceholder")}
        type="password"
        values={state?.fieldValues}
        errors={state?.errors}
      />

      <Button type="submit" isLoading={isLoading}>
        {t("buttonLabel")}
      </Button>
    </form>
  );
}
