"use client";

import Image from "next/image";
import { useEffect } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";

import { useInView } from "react-intersection-observer";

const gradients = [
  "from-primary to-primary/50",
  "from-primary/50 to-primary",
  "from-primary to-primary/50",
  "from-primary/50 to-primary",
];

export function Playlists() {
  const [data, { isFetchingNextPage, fetchNextPage, hasNextPage }] =
    api.spotify.getPlaylists.useSuspenseInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const playlists = data?.pages.flatMap((page) => page.items ?? []) ?? [];

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <ul className="grid h-full w-full grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}

      {isFetchingNextPage && <PlaylistCardSkeleton />}
      <div ref={ref} />
    </ul>
  );
}

export function PlaylistCardSkeleton() {
  return (
    <ul className="grid h-full w-full grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      <Skeleton className="aspect-square" />
      <Skeleton className="aspect-square" />
      <Skeleton className="aspect-square" />
      <Skeleton className="aspect-square" />
      <Skeleton className="aspect-square" />
      <Skeleton className="aspect-square" />
      <Skeleton className="aspect-square" />
      <Skeleton className="aspect-square" />
      <Skeleton className="aspect-square" />
      <Skeleton className="aspect-square" />
      <Skeleton className="aspect-square" />
      <Skeleton className="aspect-square" />
      <Skeleton className="aspect-square" />
      <Skeleton className="aspect-square" />
      <Skeleton className="aspect-square" />
      <Skeleton className="aspect-square" />
    </ul>
  );
}

type Playlist = RouterOutputs["spotify"]["getPlaylists"]["items"][number];
function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <Card className="relative isolate aspect-square overflow-hidden">
      <CardHeader className="z-10 bg-background/50">
        <CardTitle className="line-clamp-1 text-xl">{playlist.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {playlist.description}
        </CardDescription>
      </CardHeader>

      {playlist.image ? (
        <Image
          src={playlist.image}
          alt={playlist.name}
          fill
          className="-z-10 w-full rounded-md object-cover opacity-50"
        />
      ) : (
        <div
          className={cn(
            "absolute inset-0 -z-10 w-full rounded-md bg-gradient-to-r object-cover opacity-50",
            gradients[Math.floor(Math.random() * gradients.length)],
          )}
        />
      )}
    </Card>
  );
}
