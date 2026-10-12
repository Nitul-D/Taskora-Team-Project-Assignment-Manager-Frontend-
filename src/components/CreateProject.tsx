import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProjectStore } from "@/stores/useProjectStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect } from "react";
import ImageUploadField from "./ImageUploadField";
import DocumentUploadField, { type UploadedDocument } from "./DocumentUploadField";

const CreateProject = () => {
  const { createProject } = useProjectStore();
  const { users, fetchUsers } = useUserStore();
  const assignableUsers = users.filter(
    (user) => !user.isOwner && !user.isPrimaryAdmin,
  );
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<UploadedDocument | null>(null);

  const resetForm = () => {
    setName("");
    setDescription("");
    setAssignedTo("");
    setImageData(null);
    setAttachment(null);
  };

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) resetForm();
    setOpen(isOpen);
  };

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleCreate = async () => {
    const created = await createProject({
      name,
      description,
      assignedTo,
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
          Create Assignments
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Create New Assignments</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Assignments name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <ImageUploadField
            label="Assignment image"
            value={imageData}
            onChange={setImageData}
          />

          <DocumentUploadField value={attachment} onChange={setAttachment} />

          <Select value={assignedTo} onValueChange={setAssignedTo}>
            <SelectTrigger>
              <SelectValue placeholder="Assign to user" />
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
            disabled={!name.trim() || !assignedTo}
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProject;
