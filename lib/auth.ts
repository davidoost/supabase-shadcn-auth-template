"use server";

import { createClient } from "@/lib/supabase/server";
import {
  AsyncFormResult,
  AsyncResult,
  FormResult,
  UserProfile,
} from "@/lib/types";
import {
  ForgotPasswordData,
  forgotPasswordSchema,
  LoginData,
  loginSchema,
  ResetPasswordData,
  resetPasswordSchema,
  SignupData,
  signupSchema,
  UpdateUserData,
  updateUserSchema,
} from "@/schemas/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";
import { redirect } from "./i18n/navigation";
import { getLocale } from "next-intl/server";

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

  redirect({ href: "/profile", locale: locale });
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

  redirect({ href: "/", locale: locale });
}

export async function getCurrentUser(): AsyncResult<UserProfile> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "no user" };
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data };
}

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

export async function updateUser(
  prevState: FormResult<UpdateUserData>,
  formData: FormData
): AsyncFormResult<UpdateUserData> {
  const rawData = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
  };

  const userId = formData.get("id") as string;

  const schema = await updateUserSchema();
  const parsed = schema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: z.treeifyError(parsed.error).properties,
      fieldValues: rawData,
    };
  }

  const supabase = await createClient();

  if (rawData.email != prevState?.fieldValues?.email) {
    const { error } = await supabase.auth.updateUser({ email: rawData.email });

    if (error) {
      console.error(error);
      return { success: false, fieldValues: rawData, error: error.message };
    }
  }

  const { email, ...rawDataWithoutEmail } = rawData;

  const { error } = await supabase
    .from("user_profiles")
    .update(rawDataWithoutEmail)
    .eq("id", userId);

  if (error) {
    console.error(error);
    return { success: false, fieldValues: rawData, error: error.message };
  }

  revalidatePath("/");

  return { success: true, fieldValues: rawData };
}
