"use server";

import { UpdateUserData, updateUserSchema } from "@/schemas/auth";
import { createClient } from "./supabase/server";
import { AsyncFormResult, AsyncResult, FormResult, UserProfile } from "./types";
import { revalidatePath } from "next/cache";
import z from "zod";

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
