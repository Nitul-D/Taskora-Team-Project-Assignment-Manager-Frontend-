import { axiosConnection } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import toast from "react-hot-toast";
import { create } from "zustand";

export interface User {
  _id: string;
  clerkId: string;
  username: string;
  imageUrl: string;
  isAdmin: boolean;
  email?: string;
  isOwner?: boolean;
  isPrimaryAdmin?: boolean;
}

interface UserStore {
  users: User[];
  managedUsers: User[];
  isUsersLoading: boolean;
  usersError: string | null;
  isManagedUsersLoading: boolean;
  managedUsersError: string | null;

  fetchUsers: () => Promise<void>;
  fetchManagedUsers: () => Promise<void>;
  inviteUser: (emailAddress: string) => Promise<boolean>;
  updateUserRole: (userId: string, isAdmin: boolean) => Promise<boolean>;
  deleteManagedUser: (userId: string) => Promise<boolean>;
}

export const useUserStore = create<UserStore>((set) => ({
    users: [],
    managedUsers: [],
    isUsersLoading: false,
    usersError: null,
    isManagedUsersLoading: false,
    managedUsersError: null,

    fetchUsers: async () => {
      set({ isUsersLoading: true, usersError: null });

      try {
        const response = await axiosConnection.get("/users");

        set({ users: response.data });
      } catch (error: unknown) {
        set({ usersError: getApiErrorMessage(error, "Unable to load users") });
      } finally {
        set({ isUsersLoading: false });
      }
    },

    fetchManagedUsers: async () => {
      set({ isManagedUsersLoading: true, managedUsersError: null });

      try {
        const response = await axiosConnection.get("/admin/users");
        set({ managedUsers: response.data });
      } catch (error: unknown) {
        set({
          managedUsersError: getApiErrorMessage(
            error,
            "Unable to load user management data",
          ),
        });
      } finally {
        set({ isManagedUsersLoading: false });
      }
    },

    inviteUser: async (emailAddress) => {
      try {
        await toast.promise(
          axiosConnection.post("/admin/invitations", { emailAddress }),
          {
            loading: "Sending invitation...",
            success: "Invitation sent successfully",
          },
        );
        return true;
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Unable to send invitation"));
        return false;
      }
    },

    updateUserRole: async (userId, isAdmin) => {
      try {
        const response = await toast.promise(
          axiosConnection.patch(`/admin/users/${userId}/role`, { isAdmin }),
          {
            loading: "Updating user role...",
            success: isAdmin ? "User is now an admin" : "Admin role removed",
          },
        );
        const updatedUser = response.data.user as Pick<User, "_id" | "isAdmin">;
        set((state) => ({
          managedUsers: state.managedUsers.map((user) =>
            user._id === updatedUser._id
              ? { ...user, isAdmin: updatedUser.isAdmin }
              : user,
          ),
          users: state.users.map((user) =>
            user._id === updatedUser._id
              ? { ...user, isAdmin: updatedUser.isAdmin }
              : user,
          ),
        }));
        return true;
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Unable to update user role"));
        return false;
      }
    },

    deleteManagedUser: async (userId) => {
      try {
        await toast.promise(axiosConnection.delete(`/admin/users/${userId}`), {
          loading: "Deleting user and assigned data...",
          success: "User and assigned data deleted",
        });
        set((state) => ({
          managedUsers: state.managedUsers.filter((user) => user._id !== userId),
          users: state.users.filter((user) => user._id !== userId),
        }));
        return true;
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Unable to delete user"));
        return false;
      }
    },
  }));