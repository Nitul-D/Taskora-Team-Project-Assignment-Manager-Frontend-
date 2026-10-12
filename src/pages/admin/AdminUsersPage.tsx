import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PageLayout from "@/components/PageLayout";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import { useUser } from "@clerk/react";
import { LoaderCircle, MailPlus, RefreshCw, ShieldCheck, ShieldOff, Trash2, UsersRound } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";

const AdminUsersPage = () => {
  const { isAdmin, isLoading: isAdminLoading } = useAuthStore();
  const { user: currentUser, isLoaded, isSignedIn } = useUser();
  const { managedUsers, isManagedUsersLoading, managedUsersError, fetchManagedUsers, inviteUser, updateUserRole, deleteManagedUser} = useUserStore();
  const [emailAddress, setEmailAddress] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) void fetchManagedUsers();
  }, [fetchManagedUsers, isAdmin]);

  if (!isLoaded || isAdminLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoaderCircle className="size-8 animate-spin text-rose-400" />
      </div>
    );
  }

  if (!isSignedIn || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsInviting(true);
    const invited = await inviteUser(emailAddress);
    if (invited) setEmailAddress("");
    setIsInviting(false);
  };

  const handleRoleChange = async (userId: string, makeAdmin: boolean) => {
    setPendingUserId(userId);
    await updateUserRole(userId, makeAdmin);
    setPendingUserId(null);
  };

  const handleDelete = async (userId: string, username: string) => {
    const confirmed = window.confirm(
      `Delete ${username}? Their Clerk account, assigned tasks, and assignments will also be deleted.`,
    );
    if (!confirmed) return;

    setPendingUserId(userId);
    await deleteManagedUser(userId);
    setPendingUserId(null);
  };

  return (
    <PageLayout>
      <div className="space-y-8 p-6">
        <div className="flex items-center gap-3">
          <UsersRound className="size-10 text-rose-400" />
          <div>
            <h1 className="text-4xl font-bold">Manage Users</h1>
            <p className="mt-2 text-zinc-400">
              Invite accounts, manage admin access, and remove users.
            </p>
          </div>
        </div>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="space-y-4 p-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Invite a user</h2>
              <p className="mt-1 text-sm text-zinc-400">
                They will receive a sign-up invitation.
              </p>
            </div>
            <form
              onSubmit={(event) => void handleInvite(event)}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                required
                autoComplete="email"
                placeholder="name@example.com"
                aria-label="User email address"
                value={emailAddress}
                onChange={(event) => setEmailAddress(event.target.value)}
                className="h-10 border-zinc-700 bg-zinc-950 text-white"
              />
              <Button
                type="submit"
                disabled={isInviting}
                className="h-10 shrink-0 bg-zinc-800 text-white hover:bg-rose-600"
              >
                {isInviting ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <MailPlus className="size-4" />
                )}
                Send invitation
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Accounts</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {managedUsers.length} registered{" "}
                  {managedUsers.length === 1 ? "user" : "users"}
                </p>
              </div>
              {isManagedUsersLoading && (
                <LoaderCircle className="size-5 animate-spin text-zinc-400" />
              )}
            </div>

            {managedUsersError && (
              <div role="alert" className="flex flex-wrap items-center gap-3 text-sm">
                <p className="text-rose-400">{managedUsersError}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void fetchManagedUsers()}
                  className="border-zinc-700 bg-black text-white hover:bg-black hover:text-green-400"
                >
                  <RefreshCw className="size-3.5" />
                  Retry
                </Button>
              </div>
            )}

            {!isManagedUsersLoading && managedUsers.length === 0 && !managedUsersError && (
              <p className="rounded-lg border border-zinc-800 p-6 text-center text-sm text-zinc-400">
                No registered accounts yet.
              </p>
            )}

            <div className="space-y-3">
              {managedUsers.map((managedUser) => {
                const isPending = pendingUserId === managedUser._id;
                const isCurrentUser = managedUser.clerkId === currentUser?.id;
                return (
                  <div
                    key={managedUser._id}
                    className="flex flex-col gap-4 rounded-lg border border-zinc-800 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="size-10 shrink-0 border border-zinc-700">
                        <AvatarImage
                          src={managedUser.imageUrl}
                          alt={managedUser.username}
                        />
                        <AvatarFallback>
                          {managedUser.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {managedUser.username}
                          {managedUser.isOwner && (
                            <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 align-middle text-xs font-semibold text-rose-400">
                              <ShieldCheck className="size-3" />
                              Primary admin
                            </span>
                          )}
                        </p>
                        <p className="truncate text-sm text-zinc-400">
                          {managedUser.email || "No email available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {managedUser.isOwner || isCurrentUser ? (
                        <span className="text-sm font-medium text-rose-400">
                          {managedUser.isOwner
                            ? isCurrentUser
                              ? "You · Owner"
                              : "Owner"
                            : "You"}
                        </span>
                      ) : (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isPending}
                            onClick={() =>
                              void handleRoleChange(
                                managedUser._id,
                                !managedUser.isAdmin,
                              )
                            }
                            className="border-zinc-700 bg-zinc-800 text-white hover:bg-black hover:text-green-400 disabled:bg-black disabled:text-white disabled:opacity-100 dark:disabled:bg-black"
                          >
                            {isPending ? (
                              <LoaderCircle className="size-4 animate-spin" />
                            ) : managedUser.isAdmin ? (
                              <ShieldOff className="size-4" />
                            ) : (
                              <ShieldCheck className="size-4" />
                            )}
                            {managedUser.isAdmin ? "Remove admin" : "Make admin"}
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            disabled={isPending}
                            aria-label={`Delete ${managedUser.username}`}
                            onClick={() =>
                              void handleDelete(
                                managedUser._id,
                                managedUser.username,
                              )
                            }
                            className="border-zinc-700 bg-zinc-800 text-white hover:bg-black hover:text-red-400 disabled:bg-black disabled:text-white disabled:opacity-100 dark:disabled:bg-black"
                          >
                          <Trash2 className="size-4" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AdminUsersPage;
