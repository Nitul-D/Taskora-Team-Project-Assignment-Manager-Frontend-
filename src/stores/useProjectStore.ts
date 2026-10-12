import { axiosConnection } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import toast from "react-hot-toast";
import { create } from "zustand";

export interface Project {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  assignedBy?: string | null;
  assignedByName?: string;
  assignedByIsPrimaryAdmin?: boolean;
  createdByIsPrimaryAdmin?: boolean;
  createdAt: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  attachmentUrl?: string | null;
  attachmentPublicId?: string | null;
  attachmentName?: string | null;
  attachmentContentType?: string | null;
  assignedTo?: {
    _id: string;
    username: string;
    imageUrl: string;
  } | null;
}

export interface ProjectInput {
  name: string;
  description: string;
  assignedTo: string;
  imageData?: string;
  attachmentData?: string;
  attachmentName?: string;
}

export interface ProjectUpdate {
  name: string;
  description: string;
  assignedTo?: string | null;
}

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  isProjectsLoading: boolean;
  isCreateProjectLoading: boolean;
  isDeleteProjectLoading: boolean;
  projectsError: string | null;

  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<void>;
  createProject: (data: ProjectInput) => Promise<boolean>
  updateProject: (id: string,data: ProjectUpdate) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
}

export const useProjectStore = create<ProjectStore>((set) => ({
    projects: [],
    currentProject: null,
    isProjectsLoading: false,
    isCreateProjectLoading: false,
    isDeleteProjectLoading: false,
    projectsError: null,

    // FETCH ALL PROJECTS
    fetchProjects: async () => {
      set({ isProjectsLoading: true, projectsError: null });

      try {
        const response = await axiosConnection.get("/projects");
        set({ projects: response.data.projects });
      } catch (error: unknown) {
        set({ projectsError: getApiErrorMessage(error, "Unable to load assignments") });
      } finally {
        set({ isProjectsLoading: false });
      }
    },

    // FETCH PROJECT BY ID
    fetchProjectById: async (id) => {
      set({ isProjectsLoading: true, projectsError: null });

      try {
        const response = await axiosConnection.get(`/projects/${id}`);
        set({ currentProject: response.data.project });
      } catch (error: unknown) {
        set({ projectsError: getApiErrorMessage(error, "Unable to load assignment") });
      } finally {
        set({ isProjectsLoading: false });
      }
    },

    // CREATE PROJECT
    createProject: async (data) => {
      set({ isCreateProjectLoading: true });

      try {
        const response =
          await toast.promise(axiosConnection.post("/projects",data),
            {
              loading: "Creating Project...",
              success: "Project Created Successfully",
            }
          );

        set((state) => ({
          projects: [response.data.project, ...state.projects],
        }));
        return true;
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Unable to create assignment"));
        return false;
      } finally {
        set({ isCreateProjectLoading: false });
      }
    },

    // UPDATE PROJECT
    updateProject: async (id,data) => {
      try {
        const response = await toast.promise(axiosConnection.put(`/projects/${id}`,data),
            {
              loading: "Updating Project...",
              success: "Project Updated Successfully",
            }
          );

        set((state) => ({ projects: state.projects.map((project) => project._id === id ? response.data.updated : project),
        }));
        return true;
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Unable to update assignment"));
        return false;
      }
    },

    // DELETE PROJECT
    deleteProject: async (id) => {
      set({ isDeleteProjectLoading: true });

      try {
        await toast.promise(axiosConnection.delete(`/projects/${id}`),
          {
            loading: "Deleting Project...",
            success: "Project Deleted Successfully",
          }
        );

        set((state) => ({ projects: state.projects.filter((project) => project._id !== id)}));
        return true;
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Unable to delete assignment"));
        return false;
      } finally {
        set({ isDeleteProjectLoading: false });
      }
    },
  }));