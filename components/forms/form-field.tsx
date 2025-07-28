"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HTMLInputTypeAttribute } from "react";

type FormFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  values?: Record<string, string>;
  errors?: Record<string, string[]>;
};

export default function FormField({
  name,
  label,
  placeholder = "",
  type = "text",
  values = {},
  errors = {},
}: FormFieldProps) {
  const defaultValue = values[name] ?? "";
  const error = errors[name]?.[0];

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={name}>{label}</Label>

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
