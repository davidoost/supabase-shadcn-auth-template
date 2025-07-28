"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import FormField from "@/components/forms/form-field";

import { login } from "@/lib/auth";

import { Loader2 } from "lucide-react";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FormField
        name="email"
        label="Email"
        placeholder="you@example.com"
        values={state?.values}
        errors={state?.errors}
      />

      <FormField
        name="password"
        label="Password"
        placeholder="••••••••"
        type="password"
        values={state?.values}
        errors={state?.errors}
      />

      {!state?.success && state?.message && (
        <p className="text-sm text-destructive">{state?.message}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Logging in
          </>
        ) : (
          "Log in"
        )}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account yet?{" "}
        <Link href="/auth/signup" className="underline underline-offset-4">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
