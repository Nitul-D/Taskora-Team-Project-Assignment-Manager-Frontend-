import { axiosConnection } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import toast from "react-hot-toast";
import { create } from "zustand";

export interface Task {
  _id: string;
  title: string;
  status: "todo" | "halfway" | "completed";
  assignedTo: {_id: string; username: string; imageUrl: string}
  assignedBy: string;
  assignedByName?: string;
  assignedByIsPrimaryAdmin?: boolean;
  createdByIsPrimaryAdmin?: boolean;
  dDate: string;
  projectId: {_id: string; name: string};
  imageUrl?: string | null;
  imagePublicId?: string | null;
  attachmentUrl?: string | null;
  attachmentPublicId?: string | null;
  attachmentName?: string | null;
  attachmentContentType?: string | null;
}

export interface TaskUpdate {
  title?: string;
  status?: Task["status"];
  assignedTo?: string;
  projectId?: string;
  dDate?: string;
}

export interface TaskInput {
  title: string;
  projectId: string;
  assignedTo: string;
  status: Task["status"];
  imageData?: string;
  attachmentData?: string;
  attachmentName?: string;
}

interface TaskStore {
  tasks: Task[];
  isTasksLoading: boolean;
  isCreateTaskLoading: boolean;
  isDeleteTaskLoading: boolean;
  tasksError: string | null;

  fetchTasks: () => Promise<void>;
  createTask: (data: TaskInput) => Promise<boolean>;
  updateTask: (id: string,data: TaskUpdate) => Promise<boolean>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
    tasks: [],
    isTasksLoading: false,
    isCreateTaskLoading: false,
    isDeleteTaskLoading: false,
    tasksError: null,

    // FETCH TASKS
    fetchTasks: async () => {
      set({ isTasksLoading: true, tasksError: null });

      try {
        const response = await axiosConnection.get("/tasks");

        set({ tasks: response.data.tasks });
      } catch (error: unknown) {
        set({ tasksError: getApiErrorMessage(error, "Unable to load tasks") });
      } finally {
        set({ isTasksLoading: false });
      }
    },

    // CREATE TASK
    createTask: async (data) => {
      set({ isCreateTaskLoading: true });

      try {
        const response = await toast.promise(
          axiosConnection.post("/tasks", data),
          {
            loading: "Assigning Task...",
            success: "Task Assigned Successfully",
          },
        );

        set((state) => ({ tasks: [response.data.task, ...state.tasks] }));
        return true;
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Task creation failed"));
        return false;
      } finally {
        set({ isCreateTaskLoading: false });
      }
    },

    // UPDATE TASK
    updateTask: async (id,data) => {
      try {
        const response = await toast.promise(axiosConnection.put(`/tasks/${id}`, data),
            {
              loading: "Updating Task...",
              success: "Task Updated Successfully",
            }
          );

        set((state) => ({tasks: state.tasks.map((task) => task._id === id ? response.data.updated : task)}));
        return true;
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Unable to update task"));
        return false;
      }
    },

    // DELETE TASK
    deleteTask: async (id) => {
      set({ isDeleteTaskLoading: true });

      try {
        await toast.promise(axiosConnection.delete(`/tasks/${id}`),
          {
            loading: "Deleting Task...",
            success: "Task Deleted Successfully",
          }
        );

        set((state) => ({ tasks: state.tasks.filter((task) => task._id !== id )}));
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Unable to delete task"));
      } finally {
        set({ isDeleteTaskLoading: false });
      }
    },
  }));