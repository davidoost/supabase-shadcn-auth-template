"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/lib/i18n/navigation";
import { FormFieldError } from "@/lib/types";
import { useTranslations } from "next-intl";
import { HTMLInputTypeAttribute } from "react";

type FormFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  values?: Record<string, string>;
  errors?: Record<string, FormFieldError>;
  forgotPassword?: boolean;
};

export default function FormField({
  name,
  label,
  placeholder = "",
  type = "text",
  values = {},
  errors = {},
  forgotPassword = false,
}: FormFieldProps) {
  const defaultValue = values[name] ?? "";
  const error = errors[name]?.errors[0];
  const t = useTranslations("loginForm");

  return (
    <div className="flex flex-col gap-1">
      <div className="w-full flex justify-between">
        <Label htmlFor={name}>{label}</Label>
        {forgotPassword && (
          <Link
            href={"/auth/forgot-password"}
            className="text-sm text-muted-foreground"
          >
            {t("forgotPasswordText")}
          </Link>
        )}
      </div>

      <Input
        name={name}
        id={name}
        placeholder={placeholder}
        type={type}
        className="text-sm mt-1"
        defaultValue={defaultValue}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
