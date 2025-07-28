import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "@/components/forms/login";

export default async function LoginPage() {
  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Log in</CardTitle>
        <CardDescription>Enter your details to log in</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </>
  );
}
