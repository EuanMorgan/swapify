import { redirect } from "next/navigation";
import { Nav } from "~/app/(main)/nav";
import { getServerAuthSession } from "~/server/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/login");
  }

  return (
    <div className="isolate flex h-full w-full flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-8 pt-24">
        {children}
      </main>
    </div>
  );
}
