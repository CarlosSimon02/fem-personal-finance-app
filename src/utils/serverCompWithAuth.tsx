import { UserEntity } from "@/core/entities/UserEntity";
import { getAuthTokens } from "@/utils/getAuthTokens";
import { redirect } from "next/navigation";
import { tokensToUserEntity } from "./tokensToUserEntity";

export type ServerCompWithAuthProps = {
  user: UserEntity;
};

export function serverCompWithAuth<P extends ServerCompWithAuthProps>(
  WrappedComponent: React.ComponentType<P>
) {
  return async function AuthenticatedComponent(
    props: Omit<P, keyof ServerCompWithAuthProps>
  ) {
    const tokens = await getAuthTokens();

    if (!tokens) {
      redirect("login");
    }

    const user = tokensToUserEntity(tokens.decodedToken);

    return <WrappedComponent {...(props as P)} user={user} />;
  };
}
