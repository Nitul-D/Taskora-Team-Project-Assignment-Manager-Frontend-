import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { useTaskStore, type Task } from "@/stores/useTaskStore";
import { useUserStore, type User } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore";

const EditTask = ({ task }: { task: Task }) => {
  const { updateTask } = useTaskStore();
  const { users } = useUserStore();
  const { isAdmin, isPrimaryAdmin } = useAuthStore();
  const assigneeLocked =
    !isPrimaryAdmin &&
    (task.assignedByIsPrimaryAdmin || task.createdByIsPrimaryAdmin);
  const assignableUsers = users.filter(
    (user) => !user.isOwner && !user.isPrimaryAdmin,
  );

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);
  const [assignedTo, setAssignedTo] = useState(task.assignedTo?._id || "");

  const handleUpdate = async () => {
    const updated = await updateTask(
      task._id,
      isAdmin
        ? { title, status, ...(!assigneeLocked ? { assignedTo } : {}) }
        : { status },
    );
    if (updated) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" aria-label={isAdmin ? "Edit task" : "Update task status"}>
          <Pencil className="size-4 text-sky-400" />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>{isAdmin ? "Edit Task" : "Update Task Status"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isAdmin && (
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          )}

          {/* STATUS */}
          <Select
            value={status}
            onValueChange={(value) => {
              if (value === "todo" || value === "halfway" || value === "completed") {
                setStatus(value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {(["todo", "halfway", "completed"] as const).map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isAdmin && (
            <Select
              value={assignedTo}
              onValueChange={setAssignedTo}
              disabled={assigneeLocked}
            >
              <SelectTrigger>
                <SelectValue placeholder="Assign User" />
              </SelectTrigger>

              <SelectContent>
                {assignableUsers.map((user: User) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            className="w-full bg-rose-500 hover:bg-rose-600"
            onClick={handleUpdate}
          >
            {isAdmin ? "Update Task" : "Save Status"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTask;
