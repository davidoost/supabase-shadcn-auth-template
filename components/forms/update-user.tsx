"use client";

import FormField from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/lib/users";
import { KeyRound } from "lucide-react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { UserProfile } from "@/lib/types";
import { Input } from "../ui/input";
import { Link } from "@/lib/i18n/navigation";

export default function UpdateUserForm({
  first_name,
  last_name,
  email,
  id,
}: UserProfile) {
  const [state, action, isLoading] = useActionState(updateUser, {
    fieldValues: { email: email, first_name: first_name, last_name: last_name },
  });

  const t = useTranslations("updateUserForm");

  return (
    <form action={action} className="flex flex-col gap-6">
      <Input name="id" value={id} readOnly hidden />

      <FormField
        name="email"
        label={t("emailLabel")}
        values={state?.fieldValues}
        errors={state?.errors}
      />

      <FormField
        name="first_name"
        label={t("firstNameLabel")}
        values={state?.fieldValues}
        errors={state?.errors}
      />

      <FormField
        name="last_name"
        label={t("lastNameLabel")}
        values={state?.fieldValues}
        errors={state?.errors}
      />

      <Button type="submit" isLoading={isLoading}>
        {t("buttonLabel")}
      </Button>

      <Button variant={"ghost"} asChild>
        <Link href={"/auth/reset-password"}>
          <KeyRound />
          {t("changePasswordButtonLabel")}
        </Link>
      </Button>
    </form>
  );
}
