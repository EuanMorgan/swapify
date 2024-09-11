"use client";

import { FaSpotify } from "react-icons/fa";
import { Button } from "~/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";
export function SpotifyLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      loading={isLoading}
      variant={"spotify"}
      className="w-full"
      onClick={async () => {
        setIsLoading(true);
        await signIn("spotify");
      }}
    >
      Login with Spotify
      <FaSpotify className="ml-2 size-4 text-white" />
    </Button>
  );
}
