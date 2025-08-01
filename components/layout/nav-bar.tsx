"use server";

import { Link } from "@/lib/i18n/navigation";
import { Button } from "../ui/button";
import LocaleSwitcher from "./locale-switcher";
import Logo from "./logo";
import ThemeSwitcher from "./theme-switcher";
import { getCurrentUser } from "@/lib/auth";

export default async function NavBar() {
  const userRes = await getCurrentUser();
  return (
    <div className="bg-background w-full h-16 border-b p-4 flex justify-between items-center">
      <Logo />
      <div className="flex items-center gap-2">
        {userRes.success ? (
          <Button size={"sm"} variant={"outline"} asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        ) : (
          <Button size={"sm"} variant={"ghost"} asChild>
            <Link href="/auth/login">Log In</Link>
          </Button>
        )}
        <LocaleSwitcher />
        <ThemeSwitcher />
      </div>
    </div>
  );
}
