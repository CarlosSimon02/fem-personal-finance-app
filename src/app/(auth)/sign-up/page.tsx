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
import SignUpForm from "./_components/sign-up-form";

export const SignUpPage = () => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter className="flex justify-center">
        <CardDescription>
          Already have an account?{" "}
          <Button variant="link" className="p-0" asChild>
            <Link href="/sign-up">Login</Link>
          </Button>
        </CardDescription>
      </CardFooter>
    </Card>
  );
};

export default SignUpPage;
