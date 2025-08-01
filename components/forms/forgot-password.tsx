"use client";

import FormField from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslations } from "next-intl";
import { Input } from "../ui/input";
import { usePathname } from "@/lib/i18n/navigation";

export default function ForgotPasswordForm() {
  const [state, action, isLoading] = useActionState(requestPasswordReset, null);

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

      {state?.success && (
        <Alert className="text-green-600">
          <AlertTitle>{t("successLabel")}</AlertTitle>
          <AlertDescription>{t("successText")}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
