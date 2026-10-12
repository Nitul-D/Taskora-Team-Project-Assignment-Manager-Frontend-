import { Link } from "react-router-dom";
import {
  FolderKanban,
  ClipboardList,
  ChartColumn,
  ShieldCheck,
  Home,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProjectStore } from "@/stores/useProjectStore";
import { useTaskStore } from "@/stores/useTaskStore";
import { useUser } from "@clerk/react";
import { useEffect } from "react";
import LoginPromptTaskManager from "./LoginPromptTaskManager";

const LeftSidebar = () => {
  const { isAdmin } = useAuthStore();
  const { isSignedIn, isLoaded } = useUser();
  const { fetchProjects } = useProjectStore();
  const { fetchTasks } = useTaskStore();

  useEffect(() => {
    if (isSignedIn) {
      fetchProjects();
      fetchTasks();
    }
  }, [isSignedIn, fetchProjects, fetchTasks]);

  if (!isLoaded) return null;

  return (
    <div className="h-full rounded-lg bg-zinc-900 overflow-hidden flex flex-col">
      {isSignedIn ? (
        <>
          <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-zinc-500 text-sm font-semibold text-white"
              aria-hidden="true"
            >
              T
            </div>
            <span className="text-sm font-semibold tracking-wide text-white">
              WORKSPACE
            </span>
          </div>
          <nav className="space-y-2 p-4 overflow-y-auto">
            <Link
              to="/"
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-start text-white hover:bg-zinc-800 hover:text-rose-400",
                }),
              )}
              aria-label="Go to dashboard"
            >
              <Home className="mr-2 size-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              to={"/projects"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-start text-white hover:bg-zinc-800 hover:text-rose-400",
                }),
              )}
            >
              <FolderKanban className="mr-2 size-5" />
              <span>Assignments</span>
            </Link>

            <Link
              to={"/tasks"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-start text-white hover:bg-zinc-800 hover:text-rose-400",
                }),
              )}
            >
              <ClipboardList className="mr-2 size-5" />
              <span>{isAdmin ? "Assign Tasks" : "My Tasks"}</span>
            </Link>

            <Link
              to={"/progress"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-start text-white hover:bg-zinc-800 hover:text-rose-400",
                }),
              )}
            >
              <ChartColumn className="mr-2 size-5" />
              <span>Progress</span>
            </Link>

            {isAdmin && (
              <Link
                to={"/admin"}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className:
                      "w-full justify-start text-white hover:bg-zinc-800 hover:text-rose-400",
                  }),
                )}
              >
                <ShieldCheck className="mr-2 size-5" />
                <span>Admin Panel</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to={"/admin/users"}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className:
                      "w-full justify-start text-white hover:bg-zinc-800 hover:text-rose-400",
                  }),
                )}
              >
                <UsersRound className="mr-2 size-5" />
                <span>Manage Users</span>
              </Link>
            )}
          </nav>
        </>
      ) : (
        <div className="flex-1 p-2">
          <LoginPromptTaskManager />
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
