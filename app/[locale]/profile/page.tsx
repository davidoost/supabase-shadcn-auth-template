import LogoutButton from "@/components/forms/logout-button";
import UpdateUserForm from "@/components/forms/update-user";
import { ResponsiveDrawer } from "@/components/layout/responsive-drawer";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/users";
import { Pencil } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const userRes = await getCurrentUser();

  if (!userRes.success) {
    redirect("/");
  }

  const userProfile = userRes.data;

  const t = await getTranslations("userPage");

  return (
    <main className="w-full flex flex-col items-center p-8 py-16">
      <div className="w-full flex flex-col max-w-2xl gap-4">
        <h1 className="text-4xl font-bold">
          {t("greeting", { name: userProfile.first_name })}
        </h1>
        <p>{t("message")}</p>
        <pre className="bg-background text-sm text-muted-foreground rounded-lg border border-border p-4 overflow-y-auto">
          {JSON.stringify(userProfile, null, 2)}
        </pre>
        <div className="w-full flex justify-end gap-2">
          <ResponsiveDrawer
            title={t("editProfileTitle")}
            trigger={
              <Button variant={"outline"}>
                <Pencil />
                {t("edit")}
              </Button>
            }
            subtitle={t("editProfileSubtitle")}
          >
            <UpdateUserForm {...userProfile} />
          </ResponsiveDrawer>

          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
