import { axiosConnection } from "@/lib/axios";
import { useAuth } from "@clerk/react";
import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProjectStore } from "@/stores/useProjectStore";
import { useTaskStore } from "@/stores/useTaskStore";
import { useUserStore } from "@/stores/useUserStore";
import { io } from "socket.io-client";

//for token everytime the page is refresh and check for authorization from the server backend
const updateApiToken = (token: string | null) => {
  if (token) {
    axiosConnection.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosConnection.defaults.headers.common["Authorization"];
  }
};

//for loading state, spinner and token checking
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus, reset, setAdminStatus } = useAuthStore();

  useEffect(() => {
    if (!isLoaded) return;

    let active = true;
    let roleSocket: ReturnType<typeof io> | undefined;
    const interceptorId = axiosConnection.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }
      return config;
    });

    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);
        if (isSignedIn) {
          await checkAdminStatus();
          const apiUrl = axiosConnection.defaults.baseURL;
          if (!apiUrl) {
            throw new Error("VITE_API_URL is required for real-time role updates");
          }
          if (active && token) {
            const socketUrl = new URL(apiUrl);
            socketUrl.pathname = socketUrl.pathname.replace(/\/api\/?$/, "");
            roleSocket = io(socketUrl.origin, {
              auth: (callback) => {
                void getToken({ skipCache: true })
                  .then((freshToken) => callback({ token: freshToken }))
                  .catch((error: unknown) => {
                    console.error("Unable to refresh role update token:", error);
                    callback({});
                  });
              },
            });
            roleSocket.on("connect", () => {
              void useProjectStore.getState().fetchProjects();
              void useTaskStore.getState().fetchTasks();
              const userStore = useUserStore.getState();
              void userStore.fetchUsers();
              if (useAuthStore.getState().isAdmin) {
                  void userStore.fetchManagedUsers();
              }
            });
            roleSocket.on(
              "admin:role:update",
              (roleUpdate: { userId: string; isAdmin: boolean }) => {
                if (
                  roleUpdate?.userId !== userId ||
                  typeof roleUpdate.isAdmin !== "boolean"
                ) {
                  return;
                }
                setAdminStatus(roleUpdate.isAdmin);
              },
            );
            roleSocket.on(
              "app:data:changed",
              (change: { resources?: unknown }) => {
                if (!Array.isArray(change?.resources)) return;

                const resources = new Set(change.resources);
                if (resources.has("projects")) {
                  void useProjectStore.getState().fetchProjects();
                }
                if (resources.has("tasks")) {
                  void useTaskStore.getState().fetchTasks();
                }
                if (resources.has("users")) {
                  const userStore = useUserStore.getState();
                  void userStore.fetchUsers();
                  if (useAuthStore.getState().isAdmin) {
                    void userStore.fetchManagedUsers();
                  }
                }
              },
            );
            roleSocket.on("connect_error", (error) => {
              console.error("Unable to connect to role updates:", error.message);
            });
          }
        } else {
          reset();
        }
      } catch (error: unknown) {
        updateApiToken(null);
        console.error("Error in Provider", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    initAuth();
    return () => {
      active = false;
      roleSocket?.disconnect();
      axiosConnection.interceptors.request.eject(interceptorId);
    };
  }, [checkAdminStatus, getToken, isLoaded, isSignedIn, reset, setAdminStatus, userId]);

  //hide screen and center the spinner
  //spinner properties
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  return (
  <>
  {children}
  </>
  )
};

export default AuthProvider;
