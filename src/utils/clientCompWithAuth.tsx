"use client";

import { UserEntity } from "@/core/entities/UserEntity";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { redirect } from "next/navigation";

export type ClientCompWithAuthProps = {
  user: UserEntity;
};

const clientCompWithAuth = <P extends ClientCompWithAuthProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function AuthenticatedComponent(
    props: Omit<P, keyof ClientCompWithAuthProps>
  ) {
    const { user } = useAuth();

    if (!user) {
      redirect("login");
    }

    return <WrappedComponent {...(props as P)} user={user} />;
  };
};

export default clientCompWithAuth;
