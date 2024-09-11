import { Suspense } from "react";
import { PlaylistCardSkeleton, Playlists } from "~/app/(main)/playlists";
import { api, HydrateClient } from "~/trpc/server";

export default function Home() {
  void api.spotify.getPlaylists.prefetchInfinite({});

  return (
    <HydrateClient>
      <Suspense fallback={<PlaylistCardSkeleton />}>
        <Playlists />
      </Suspense>
    </HydrateClient>
  );
}
