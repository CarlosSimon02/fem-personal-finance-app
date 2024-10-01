import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./_components/login-form";

export const LoginPage = () => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="flex justify-center">
        <CardDescription>
          Need to create an account?{" "}
          <Button variant="link" className="p-0" asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </CardDescription>
      </CardFooter>
    </Card>
  );
};

export default LoginPage;
