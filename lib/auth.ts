"use server";

import {
  signupSchema,
  loginSchema,
  SignupData,
  LoginData,
} from "@/schemas/auth";
import { createClient } from "@/lib/supabase/server";
import { FormActionResult, Result, UserProfile } from "@/lib/types";
import { redirect } from "next/navigation";

export async function signup(
  prevState: any,
  formData: FormData
): Promise<FormActionResult<SignupData>> {
  const rawData = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    password: formData.get("password") as string,
    confirm_password: formData.get("confirm_password") as string,
  };

  const parsed = signupSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      values: rawData,
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
      values: rawData,
    };
  }

  return {
    success: true,
    values: rawData,
  };
}

export async function login(
  prevState: any,
  formData: FormData
): Promise<FormActionResult<LoginData>> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      values: rawData,
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
      values: rawData,
      message: error.message,
    };
  }

  redirect("/dashboard");
}

export async function logout(): Promise<FormActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);

    return {
      success: false,
      message: error.message,
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
