import { Zap } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "@/lib/i18n/navigation";

export default function Logo() {
  return (
    <Button variant={"ghost"} className="font-semibold text-base" asChild>
      <Link href={"/"}>
        <Zap />
        Acme Inc.
      </Link>
    </Button>
  );
}
