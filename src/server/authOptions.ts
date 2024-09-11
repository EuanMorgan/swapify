import { type NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

import { env } from "~/env";

export const baseAuthOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  providers: [
    SpotifyProvider({
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
    verifyRequest: "/login",
    newUser: "/login",
  },
  // session: {
  //   strategy: "jwt",
  // },
};
