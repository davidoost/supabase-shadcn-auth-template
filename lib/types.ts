export type Result<T = undefined> = T extends undefined
  ? { success: true } | { success: false; error: string }
  : { success: true; data: T } | { success: false; error: string };

export type FormActionResult<
  TValues = unknown,
  TErrors = Record<string, string[]>
> = {
  success: boolean;
  values?: TValues;
  errors?: TErrors;
  message?: string;
};

export type UserProfile = {
  id: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
};
