import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Trash2 } from "lucide-react";
import { useTaskStore } from "@/stores/useTaskStore";
import CreateTask from "@/components/CreateTask";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import EditTask from "@/components/EditTask";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect } from "react";
import ImageViewer, { ImageDownloadButton } from "@/components/ImageViewer";
import AttachmentDownloadLink from "@/components/AttachmentDownloadLink";

const TasksPage = () => {
  const { tasks, deleteTask } = useTaskStore();
  const { isAdmin, isPrimaryAdmin } = useAuthStore();
  const fetchUsers = useUserStore((state) => state.fetchUsers);

  useEffect(() => {
    if (isAdmin) void fetchUsers();
  }, [fetchUsers, isAdmin]);

  return (
    <PageLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Tasks</h1>
            <p className="text-zinc-400 mt-2">
              {isAdmin
                ? "Manage all assigned tasks"
                : "Admin has assigned you tasks"}
            </p>
          </div>
          {isAdmin && <CreateTask />}
        </div>

        <div className="space-y-5">
          {tasks.map((task) => (
            <Card key={task._id} className=" bg-zinc-900 border-zinc-800">
              <CardContent className="space-y-4 p-6">
                {task.imageUrl && (
                  <ImageViewer
                    src={task.imageUrl}
                    alt={`${task.title} task image`}
                    filename={`${task.title}-task`}
                  />
                )}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <ClipboardList className="size-10 text-sky-400" />
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {task.title}
                      </h2>
                      <p className="text-zinc-400 text-sm mt-1">
                        Project: {task.projectId?.name}
                      </p>
                      <p className="text-zinc-500 text-xs mt-2">
                        Assigned To: {task.assignedTo?.username}
                      </p>
                      <p className="text-zinc-500 text-xs mt-1">
                        Assigned By: {task.assignedByName ?? "Unknown"}
                      </p>
                      {task.attachmentUrl && task.attachmentName && (
                        <div className="mt-3">
                          <AttachmentDownloadLink
                            url={task.attachmentUrl}
                            name={task.attachmentName}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm
                      ${
                        task.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : task.status === "halfway"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {task.status}
                    </span>

                    <EditTask task={task} />

                    {task.imageUrl && (
                      <ImageDownloadButton
                        src={task.imageUrl}
                        filename={`${task.title}-task`}
                      />
                    )}

                    {isAdmin &&
                      (isPrimaryAdmin ||
                        (!task.assignedByIsPrimaryAdmin &&
                          !task.createdByIsPrimaryAdmin)) && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteTask(task._id)}
                      >
                        <Trash2 className="size-4 text-red-400" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default TasksPage;
