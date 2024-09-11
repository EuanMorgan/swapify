import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { and, eq } from "drizzle-orm";
import SpotifyWebApi from "spotify-web-api-node";
import { env } from "~/env";
import { accounts } from "~/server/db/schema";

// credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: env.SPOTIFY_CLIENT_ID,
  clientSecret: env.SPOTIFY_CLIENT_SECRET,
});

/**
 * This procedure is used to protect the Spotify API from unauthorized access.
 * It checks if the user is connected to Spotify and refreshes the token if it is expired.
 */
export const protectedSpotifyProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const userAccessToken = await ctx.db.query.accounts.findFirst({
      where: and(
        eq(accounts.userId, ctx.session.user.id),
        eq(accounts.provider, "spotify"),
      ),
    });

    if (!userAccessToken?.access_token) {
      throw new Error("User not connected to Spotify");
    }

    spotifyApi.setAccessToken(userAccessToken.access_token);
    spotifyApi.setRefreshToken(userAccessToken.refresh_token!);

    if (
      userAccessToken.expires_at &&
      userAccessToken.expires_at < Date.now() / 1000
    ) {
      console.log("Refreshing token");
      const newToken = await spotifyApi.refreshAccessToken();
      spotifyApi.setAccessToken(newToken.body.access_token);

      await ctx.db
        .update(accounts)
        .set({
          access_token: newToken.body.access_token,
          expires_at: newToken.body.expires_in,
          refresh_token: newToken.body.refresh_token,
        })
        .where(
          eq(accounts.providerAccountId, userAccessToken.providerAccountId),
        );
    }

    return next({
      ctx: {
        ...ctx,
        spotifyApi,
      },
    });
  },
);

export const spotifyRouter = createTRPCRouter({
  getPlaylists: protectedSpotifyProcedure
    .input(
      z.object({
        cursor: z.number().default(0),
      }),
    )
    .query(async ({ input, ctx }) => {
      const playlists = await ctx.spotifyApi.getUserPlaylists({
        limit: 50,
        offset: input.cursor ?? 0,
      });
      return {
        items:
          playlists.body.items.map((playlist) => ({
            id: playlist.id,
            name: playlist.name,
            image: playlist.images?.[0]?.url,
            description: playlist.description,
          })) ?? [],
        total: playlists.body.total,
        nextCursor: playlists.body.next ? (input.cursor ?? 0) + 50 : null,
      };
    }),
});
