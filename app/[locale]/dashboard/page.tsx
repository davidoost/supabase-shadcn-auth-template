import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const userRes = await getCurrentUser();

  if (!userRes.success) {
    redirect("/");
  }

  const userProfile = userRes.data;

  return (
    <div>
      <pre>{JSON.stringify(userProfile, null, 2)}</pre>
    </div>
  );
}
