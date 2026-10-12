import { axiosConnection } from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import {  create } from "zustand";

interface AuthStore {
    isAdmin: boolean;
    isPrimaryAdmin: boolean;
    isLoading: boolean;
    error: string | null;

    checkAdminStatus: () => Promise<void>;
    setAdminStatus: (isAdmin: boolean, isPrimaryAdmin?: boolean) => void;
    reset: () => void;
}


export const useAuthStore = create <AuthStore> ((set) => ({
   isAdmin: false,
   isPrimaryAdmin: false,
   isLoading: false,
   error: null,

   checkAdminStatus: async () => {
    set ({ isLoading: true, error: null});
    try{
        const response = await axiosConnection.get("/admin/check");
        set ({
          isAdmin: response.data.admin,
          isPrimaryAdmin: response.data.primaryAdmin ?? false,
        });
    } catch (error: unknown) {
        set({ isAdmin: false, error: getApiErrorMessage(error, "Unable to check admin access")})
    } finally {
        set({isLoading: false});
    }
   },

   setAdminStatus: (isAdmin, isPrimaryAdmin) => {
    set((state) => ({
      isAdmin,
      isPrimaryAdmin: isPrimaryAdmin ?? (isAdmin ? state.isPrimaryAdmin : false),
      isLoading: false,
      error: null,
    }));
   },

   reset: () => {
    set({ isAdmin: false, isPrimaryAdmin: false, isLoading: false, error: null });
   }
}))