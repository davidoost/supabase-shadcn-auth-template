"use server";

import { createClient } from "@/lib/supabase/server";
import { AsyncFormResult, FormResult } from "@/lib/types";
import {
  LoginData,
  loginSchema,
  SignupData,
  signupSchema,
} from "@/schemas/auth";
import { headers } from "next/headers";
import z from "zod";
import { getLocale } from "next-intl/server";
import { redirect } from "./i18n/navigation";

export async function signup(
  prevState: FormResult<SignupData>,
  formData: FormData
): AsyncFormResult<SignupData> {
  const rawData = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    password: formData.get("password") as string,
    confirm_password: formData.get("confirm_password") as string,
  };

  const schema = await signupSchema();
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

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        first_name: parsed.data.first_name,
        last_name: parsed.data.last_name,
      },
      emailRedirectTo: origin,
    },
  });

  if (error) {
    console.error(error);

    return {
      success: false,
      fieldValues: rawData,
    };
  }

  return {
    success: true,
    fieldValues: rawData,
  };
}

export async function login(
  prevState: FormResult<LoginData>,
  formData: FormData
): AsyncFormResult<LoginData> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const schema = await loginSchema();
  const parsed = schema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: z.treeifyError(parsed.error).properties,
      fieldValues: rawData,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    console.error(error);

    return {
      success: false,
      fieldValues: rawData,
      error: error.message,
    };
  }

  const locale = await getLocale();

  return redirect({ href: "/profile", locale: locale });
}

export async function logout(): AsyncFormResult {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);

    return {
      success: false,
      error: error.message,
    };
  }

  const locale = await getLocale();

  return redirect({ href: "/", locale: locale });
}
