import { getTranslations } from "next-intl/server";
import z from "zod";

// This file contains all schemas for validating our auth forms
// These schemas are all returned from async functions so we can use translated error messages
// Each schema is followed by an export statement to export the associated type

// Login schema and type

export async function loginSchema() {
  const t = await getTranslations("errors.formErrors");
  return z.object({
    email: z.email({ message: t("emailRequired") }),
    password: z.string().min(1, t("passwordRequired")),
  });
}

export type LoginData = z.infer<Awaited<ReturnType<typeof loginSchema>>>;

// Signup schema and type

export async function signupSchema() {
  const t = await getTranslations("errors.formErrors");
  return z
    .object({
      email: z.email({ message: t("emailRequired") }),
      first_name: z.string().min(1, t("firstNameRequired")),
      last_name: z.string().min(1, t("lastNameRequired")),
      password: z.string().min(6, t("passwordMinLength")),
      confirm_password: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
      path: ["confirm_password"],
      message: t("passwordsMismatch"),
    });
}

export type SignupData = z.infer<Awaited<ReturnType<typeof signupSchema>>>;

// ForgotPassword schema and type

export async function forgotPasswordSchema() {
  const t = await getTranslations("errors.formErrors");
  return z.object({
    email: z.email({ message: t("emailRequired") }),
  });
}

export type ForgotPasswordData = z.infer<
  Awaited<ReturnType<typeof forgotPasswordSchema>>
>;

// ResetPassword schema and type

export async function resetPasswordSchema() {
  const t = await getTranslations("errors.formErrors");
  return z
    .object({
      password: z.string().min(6, t("passwordMinLength")),
      confirm_password: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
      path: ["confirm_password"],
      message: t("passwordsMismatch"),
    });
}

export type ResetPasswordData = z.infer<
  Awaited<ReturnType<typeof resetPasswordSchema>>
>;
