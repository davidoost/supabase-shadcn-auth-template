"use server";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignupForm from "@/components/forms/signup";
import { getTranslations } from "next-intl/server";

export default async function SignupPage() {
  const t = await getTranslations("signupPage");

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
    </>
  );
}
