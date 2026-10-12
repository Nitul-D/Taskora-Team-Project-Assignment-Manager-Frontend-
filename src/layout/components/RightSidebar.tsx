import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserStore } from "@/stores/useUserStore";
import { useUser } from "@clerk/react";
import { ShieldCheck, Users } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@clerk/react";
import { axiosConnection } from "@/lib/axios";
import RightLoginPrompt from "./RightLoginPrompt";

const RightSidebar = () => {
  const { users, fetchUsers } = useUserStore();
  const { user } = useUser();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    let active = true;
    let socket: ReturnType<typeof io> | undefined;

    const connectPresence = async () => {
      try {
        if (!active) return;

        const apiUrl = axiosConnection.defaults.baseURL;
        if (!apiUrl) {
          throw new Error("VITE_API_URL is required to connect user presence");
        }

        const socketUrl = new URL(apiUrl);
        socketUrl.pathname = socketUrl.pathname.replace(/\/api\/?$/, "");
        socket = io(socketUrl.origin, {
          auth: (callback) => {
            void getToken({ skipCache: true })
              .then((token) => callback({ token }))
              .catch((error: unknown) => {
                console.error("Unable to refresh presence token:", error);
                callback({});
              });
          },
        });
        socket.on("presence:update", (userIds: string[]) => {
          setOnlineUserIds(userIds);
        });
        socket.on("connect_error", (error) => {
          console.error("Unable to connect to user presence:", error.message);
        });
      } catch (error) {
        console.error("Unable to initialize user presence:", error);
      }
    };

    void connectPresence();
    return () => {
      active = false;
      socket?.disconnect();
    };
  }, [getToken, isLoaded, isSignedIn]);

  return (
    <div className="h-full bg-zinc-900 rounded-lg flex flex-col overflow-hidden">
      {!user && <RightLoginPrompt />}

      {/* TOP */}
      {user && (
      <>
      <div className="p-4 flex justify-between items-center border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <Users className="size-5 shrink-0" />
          <h2 className="font-semibold">Other Users</h2>
        </div>
      </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {users.map((user) => (
              <div key={user._id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/40 transition">
                <div className="relative shrink-0">
                <Avatar
                  className="size-10 border border-zinc-800">
                  <AvatarImage src={user.imageUrl} alt={user.username} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-zinc-900 ${
                      onlineUserIds.includes(user.clerkId) ? "bg-green-500" : "bg-red-500"
                    }`}
                    role="img"
                    aria-label={onlineUserIds.includes(user.clerkId) ? "Online" : "Offline"}
                    title={onlineUserIds.includes(user.clerkId) ? "Online" : "Offline"}
                  />
                </div>

                <div className="min-w-0 flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">
                    {user.username}
                  </p>
                  {user.isAdmin && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-rose-400">
                      <ShieldCheck className="size-3" />
                      <span className="text-xs font-semibold">Admin</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
    </>
  )}
  </div>
);
};

export default RightSidebar;