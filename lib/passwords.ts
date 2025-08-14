"use server";

import {
  ForgotPasswordData,
  forgotPasswordSchema,
  ResetPasswordData,
  resetPasswordSchema,
} from "@/schemas/auth";
import { AsyncFormResult, FormResult } from "./types";
import { createClient } from "./supabase/server";
import { headers } from "next/headers";
import z from "zod";

export async function requestPasswordReset(
  prevState: FormResult<ForgotPasswordData>,
  formData: FormData
): AsyncFormResult<ForgotPasswordData> {
  const rawData = {
    email: formData.get("email") as string,
    redirect: formData.get("redirect") as string,
  };

  const schema = await forgotPasswordSchema();
  const parsed = schema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: z.treeifyError(parsed.error).properties,
      fieldValues: rawData,
    };
  }

  const supabase = await createClient();

  const headersList = await headers();
  const origin = headersList.get("origin") || "";

  const { error } = await supabase.auth.resetPasswordForEmail(rawData.email, {
    redirectTo: origin,
  });

  if (error) {
    console.error(error);
    return { success: false, fieldValues: rawData, error: error.message };
  }

  return { success: true, fieldValues: rawData };
}

export async function resetPassword(
  prevState: FormResult<ResetPasswordData>,
  formData: FormData
): AsyncFormResult<ResetPasswordData> {
  const rawData = {
    password: formData.get("password") as string,
    confirm_password: formData.get("confirm_password") as string,
  };

  const schema = await resetPasswordSchema();
  const parsed = schema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: z.treeifyError(parsed.error).properties,
      fieldValues: rawData,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: rawData.password,
  });

  if (error) {
    console.error(error);
    return { success: false, fieldValues: rawData, error: "some error" };
  }

  return { success: true, fieldValues: rawData };
}
