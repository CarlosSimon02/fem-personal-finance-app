import { User } from "@/core/schemas/userSchema";
import { getAuthTokens } from "@/utils/getAuthTokens";
import { redirect } from "next/navigation";
import { tokensToUser } from "./tokensToUser";

export type ServerCompWithAuthProps = {
  user: User;
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

    const user = tokensToUser(tokens.decodedToken);

    return <WrappedComponent {...(props as P)} user={user} />;
  };
}
