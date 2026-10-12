import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderKanban, Pencil, Trash2 } from "lucide-react";
import { useProjectStore } from "@/stores/useProjectStore";
import CreateProject from "@/components/CreateProject";
import PageLayout from "@/components/PageLayout";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Project } from "@/stores/useProjectStore";
import { useTaskStore } from "@/stores/useTaskStore";
import { useUserStore } from "@/stores/useUserStore";
import ImageViewer, { ImageDownloadButton } from "@/components/ImageViewer";
import AttachmentDownloadLink from "@/components/AttachmentDownloadLink";

const ProjectsPage = () => {
  const { projects, deleteProject, updateProject } = useProjectStore();
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const users = useUserStore((state) => state.users);
  const assignableUsers = users.filter(
    (user) => !user.isOwner && !user.isPrimaryAdmin,
  );
  const { isAdmin, isPrimaryAdmin } = useAuthStore();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAssignedTo, setEditAssignedTo] = useState("unassigned");
  const assigneeLocked =
    !!editingProject &&
    !isPrimaryAdmin &&
    (editingProject.assignedByIsPrimaryAdmin ||
      editingProject.createdByIsPrimaryAdmin);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditDescription(project.description);
    setEditAssignedTo(project.assignedTo?._id ?? "unassigned");
  };

  const handleUpdate = async () => {
    if (!editingProject) return;

    const updated = await updateProject(editingProject._id, {
      name: editName,
      description: editDescription,
      ...(!assigneeLocked && {
        assignedTo: editAssignedTo === "unassigned" ? null : editAssignedTo,
      }),
    });

    if (updated) {
      setEditingProject(null);
      await fetchTasks();
    }
  };

  const handleDelete = async (projectId: string) => {
    const deleted = await deleteProject(projectId);
    if (deleted) await fetchTasks();
  };

  return (
    <PageLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Assignments</h1>
            <p className="text-zinc-400 mt-2">
              {isAdmin ? "Manage all Users Assignments" : "Your Assignments"}
            </p>
          </div>

          {isAdmin && <CreateProject />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project._id} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6 space-y-5">
                {project.imageUrl && (
                  <ImageViewer
                    src={project.imageUrl}
                    alt={`${project.name} assignment`}
                    filename={`${project.name}-assignment`}
                  />
                )}
                <div className="flex items-center justify-between">
                  <FolderKanban className="size-10 text-rose-400" />
                  <div className="flex items-center gap-2">
                    {project.imageUrl && (
                      <ImageDownloadButton
                        src={project.imageUrl}
                        filename={`${project.name}-assignment`}
                      />
                    )}
                    {isAdmin && (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Edit assignment"
                          onClick={() => handleEdit(project)}
                        >
                          <Pencil className="size-5 text-sky-400" />
                        </Button>
                        {(isPrimaryAdmin ||
                          (!project.assignedByIsPrimaryAdmin &&
                            !project.createdByIsPrimaryAdmin)) && (
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Delete assignment"
                            onClick={() => void handleDelete(project._id)}
                          >
                            <Trash2 className="size-5 text-red-400" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {project.name}
                  </h2>
                  <p className="text-zinc-200 mt-3 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  {project.attachmentUrl && project.attachmentName && (
                    <div className="mt-4">
                      <AttachmentDownloadLink
                        url={project.attachmentUrl}
                        name={project.attachmentName}
                      />
                    </div>
                  )}
                  {isAdmin && (
                    <>
                      <p className="text-zinc-400 mt-3 text-sm">
                        Assigned to: {project.assignedTo?.username ?? "Unassigned"}
                      </p>
                      <p className="text-zinc-400 mt-2 text-sm">
                        Assigned by: {project.assignedByName ?? "Unknown"}
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit dialog */}
      {isAdmin && (
      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Project Name"
            />

            <Input
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
            />

            <Select
              value={editAssignedTo}
              onValueChange={setEditAssignedTo}
              disabled={assigneeLocked}
            >
              <SelectTrigger>
                <SelectValue placeholder="Assign to user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {assignableUsers.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              className="w-full bg-rose-500 hover:bg-rose-600"
              onClick={handleUpdate}
            >
              Update Assignment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      )}
    </PageLayout>
  );
};

export default ProjectsPage;
