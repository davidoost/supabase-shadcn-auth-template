"use client";

import { logout } from "@/lib/auth";
import { Button } from "../ui/button";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

export default function LogoutButton() {
  const [state, action, isLoading] = useActionState(logout, null);
  return (
    <form action={action}>
      <Button type="submit" variant={"outline"} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            Logging Out...
          </>
        ) : (
          <>Log Out</>
        )}
      </Button>
    </form>
  );
}
