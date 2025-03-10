import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  description?: string;
};

const AuthLayout = ({ children, title, description }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
