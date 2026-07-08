import { currentUser } from "@clerk/nextjs/server";
import CopyUserId from "@/components/console/CopyUserId";

export default async function  UserInfo() {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white">
        Please sign in.
      </div>
    );
  }

  const userName =
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
    user.username ||
    user.primaryEmailAddress?.emailAddress ||
    "Unknown User";

  return (
    <main className="bg-[#0A0A0A] text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Manage your account information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur">
          <div className="border-b border-zinc-800 px-6 py-5">
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>

          <div className="space-y-6 p-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <img
                src={user.imageUrl}
                alt={userName}
                className="h-16 w-16 rounded-full border border-zinc-700"
                />

              <div>
                <h3 className="text-lg font-semibold">{userName}</h3>
                <p className="text-sm text-zinc-400">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>

            {/* User ID */}
            <div>
              <p className="mb-2 text-sm text-zinc-400">User ID</p>

              <div className="rounded-xl border border-zinc-800 bg-[#111111] p-4">
                <CopyUserId userId={user.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}