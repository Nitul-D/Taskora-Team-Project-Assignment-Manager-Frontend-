import { FolderKanban } from "lucide-react";

const LoginPromptTaskManager = () => {
  return (
    <div className= "h-full bg-zinc-900 rounded-lg flex flex-col overflow-hidden">
      <div className= "h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="relative">
          <div className= "absolute -inset-1 bg-linear-to-r from-rose-500 to-sky-500 rounded-full blur-lg opacity-75 animate-pulse" aria-hidden="true"/>
          <div className= "relative bg-zinc-900 rounded-full p-4">
            <FolderKanban className= "size-8 text-rose-400"/>
          </div>
        </div>

        <div className= "space-y-2 max-w-64">
          <h3 className= "text-lg font-semibold text-white">Assignments And Tasks</h3>
          <p className= "text-sm text-zinc-400">Login now to get access to all features</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptTaskManager;
