"use client";

import FormField from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { signup } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, null);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormField
        name="email"
        label="Email"
        placeholder="you@example.com"
        values={state?.values}
        errors={state?.errors}
      />

      <div className="flex gap-2">
        <FormField
          name="first_name"
          label="First name"
          placeholder="John"
          values={state?.values}
          errors={state?.errors}
        />

        <FormField
          name="last_name"
          label="Last name"
          placeholder="Doe"
          values={state?.values}
          errors={state?.errors}
        />
      </div>

      <FormField
        name="password"
        label="Password"
        placeholder="••••••••"
        type="password"
        values={state?.values}
        errors={state?.errors}
      />

      <FormField
        name="confirm_password"
        label="Confirm Password"
        placeholder="••••••••"
        type="password"
        values={state?.values}
        errors={state?.errors}
      />

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Signing Up
          </>
        ) : (
          "Sign Up"
        )}
      </Button>

      {state?.success && (
        <Alert className="text-green-600">
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            We have sent you an email containing a link to confirm your signup.
          </AlertDescription>
        </Alert>
      )}

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/login" className="underline underline-offset-4">
          Log In
        </Link>
      </p>
    </form>
  );
}
