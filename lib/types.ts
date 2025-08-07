export type Success<T = undefined> = T extends undefined
  ? { success: true }
  : { success: true; data: T };

export type Error = { success: false; error: string };

export type Result<T = undefined> = Success<T> | Error;

export type AsyncResult<T = undefined> = Promise<Result<T>>;

export type FormFieldError = {
  errors: string[];
  items?: FormFieldError[];
};

export type FormResult<T = undefined> = T extends undefined
  ? { success?: boolean; error?: string }
  : {
      success?: boolean;
      error?: string;
      errors?: Record<string, FormFieldError>;
      fieldValues?: T;
    };

export type AsyncFormResult<T = undefined> = Promise<FormResult<T>>;

export type UserProfile = {
  id: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
};
