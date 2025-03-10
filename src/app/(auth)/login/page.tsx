import { Metadata } from "next";
import LoginForm from "../_components/LoginForm";

export const metadata: Metadata = {
  title: "Login | Personal Finance App",
  description: "Sign in to your Personal Finance App account",
};

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
