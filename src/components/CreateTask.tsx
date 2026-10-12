import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTaskStore } from "@/stores/useTaskStore";
import { useProjectStore } from "@/stores/useProjectStore";
import { useUserStore } from "@/stores/useUserStore";
import { cn } from "@/lib/utils";
import ImageUploadField from "./ImageUploadField";
import DocumentUploadField, { type UploadedDocument } from "./DocumentUploadField";

const CreateTask = () => {
  const { createTask } = useTaskStore();
  const { projects } = useProjectStore();
  const { users } = useUserStore();
  const assignableUsers = users.filter(
    (user) => !user.isOwner && !user.isPrimaryAdmin,
  );

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<UploadedDocument | null>(null);

  const resetForm = () => {
    setTitle("");
    setProjectId("");
    setAssignedTo("");
    setImageData(null);
    setAttachment(null);
  };

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) resetForm();
    setOpen(isOpen);
  };

  const handleCreate = async () => {
    const created = await createTask({
      title,
      projectId,
      assignedTo,
      status: "todo",
      ...(imageData ? { imageData } : {}),
      ...(attachment
        ? { attachmentData: attachment.data, attachmentName: attachment.name }
        : {}),
    });
    if (created) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            buttonVariants({ variant: "ghost",
              className:
                "shrink-0 text-white hover:bg-zinc-800 hover:text-rose-400",
            }),
          )}
        >
          Create Task
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* PROJECT */}
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Assignments (Optional)" />
            </SelectTrigger>

            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project._id} value={project._id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ImageUploadField
            label="Task image"
            value={imageData}
            onChange={setImageData}
          />

          <DocumentUploadField value={attachment} onChange={setAttachment} />

          {/* USER */}
          <Select value={assignedTo} onValueChange={setAssignedTo}>
            <SelectTrigger>
              <SelectValue placeholder="Assign User" />
            </SelectTrigger>

            <SelectContent>
              {assignableUsers.map((user) => (
                <SelectItem key={user._id} value={user._id}>
                  {user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="w-full bg-rose-500 hover:bg-rose-600"
            onClick={handleCreate}
            disabled={!title.trim() || !assignedTo}
          >
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTask;
