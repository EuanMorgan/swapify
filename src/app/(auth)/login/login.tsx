import { SpotifyLoginButton } from "~/app/(auth)/login/spotify-login-button";

export function Login() {
  return (
    <div className="h-full w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Ready to level up your music experience? Login with your Spotify
              below
            </p>
          </div>
          <SpotifyLoginButton />
        </div>
      </div>
      <div className="b hidden bg-muted lg:block"></div>
    </div>
  );
}
