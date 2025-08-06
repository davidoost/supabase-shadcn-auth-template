"use server";

import { createClient } from "@/lib/supabase/server";
import { AsyncFormResult, FormResult, Result, UserProfile } from "@/lib/types";
import {
  ForgotPasswordData,
  forgotPasswordSchema,
  LoginData,
  loginSchema,
  ResetPasswordData,
  resetPasswordSchema,
  SignupData,
  signupSchema,
} from "@/schemas/auth";
import { redirect } from "next/navigation";
import z from "zod";

export async function signup(
  prevState: any,
  formData: FormData
): Promise<FormResult<SignupData>> {
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

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        first_name: parsed.data.first_name,
        last_name: parsed.data.last_name,
      },
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
  prevState: any,
  formData: FormData
): Promise<FormResult<LoginData>> {
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

  redirect("/dashboard");
}

export async function logout(): Promise<FormResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);

    return {
      success: false,
      error: error.message,
    };
  }

  redirect("/");
}

export async function getCurrentUser(): Promise<Result<UserProfile>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "no user" };
  }

  const { data, error } = await supabase
    .from("x_user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data };
}

export async function requestPasswordReset(
  prevState: any,
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

  const { error } = await supabase.auth.resetPasswordForEmail(rawData.email);

  if (error) {
    console.error(error);
    return { success: false, fieldValues: rawData, error: error.message };
  }

  return { success: true, fieldValues: rawData };
}

export async function resetPassword(
  prevState: any,
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
