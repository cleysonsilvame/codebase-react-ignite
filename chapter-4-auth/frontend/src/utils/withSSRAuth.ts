import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../AuthTokenError";
import decode from "jwt-decode";
import { validateUserPermissions } from "./validateUserPermissions";

interface WithSSRAuthOptions {
  permissions?: string[];
  roles?: string[];
}

function redirectTo(to = "/") {
  return {
    redirect: {
      destination: to,
      permanent: false,
    },
  };
}

export function withSSRAuth<P>(
  fn: GetServerSideProps<P>,
  options?: WithSSRAuthOptions
) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    const token = cookies["nextauth.token"];

    if (!token) {
      return redirectTo();
    }

    if (options) {
      const user = decode<{ permissions: string[]; roles: string[] }>(token);
      const { permissions, roles } = options;

      const userHasValidPermissions = validateUserPermissions({
        user,
        permissions,
        roles,
      });

      console.log(userHasValidPermissions);

      if (!userHasValidPermissions) {
        return redirectTo("/dashboard");
      }
    }

    try {
      return await fn(ctx);
    } catch (error) {
      if (error instanceof AuthTokenError) {
        destroyCookie(ctx, "nextauth.token");
        destroyCookie(ctx, "nextauth.refreshToken");
        return redirectTo();
      }
    }
  };
}
