import { Metadata } from "next";
import SignUpForm from "../_components/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up | Personal Finance App",
  description: "Create a new account to get started with Personal Finance App",
};

const SignUpPage = () => {
  return <SignUpForm />;
};

export default SignUpPage;
