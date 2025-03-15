import { UserEntity } from "@/core/entities/UserEntity";
import { getAuthTokens } from "@/utils/getAuthTokens";
import { redirect } from "next/navigation";
import { tokensToUserEntity } from "./tokensToUserEntity";

export type WithAuthProps = {
  user: UserEntity;
};

export function withAuth<P extends WithAuthProps>(
  WrappedComponent: React.ComponentType<P>
) {
  return async function AuthenticatedComponent(
    props: Omit<P, keyof WithAuthProps>
  ) {
    const tokens = await getAuthTokens();

    if (!tokens) {
      redirect("login");
    }

    const user = tokensToUserEntity(tokens.decodedToken);

    return <WrappedComponent {...(props as P)} user={user} />;
  };
}
