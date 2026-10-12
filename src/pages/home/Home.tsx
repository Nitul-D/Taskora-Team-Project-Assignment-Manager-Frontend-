import { ChartColumn, ClipboardList, FolderKanban, Loader } from "lucide-react";
import { useProjectStore } from "@/stores/useProjectStore";
import { useTaskStore } from "@/stores/useTaskStore";
import { UserButton, useUser } from "@clerk/react";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import LoginInOAuthButtons from "@/components/LoginInOAuthButton";

const Home = () => {
  const { isProjectsLoading, projectsError, projects } = useProjectStore();
  const { tasks, isTasksLoading, tasksError } = useTaskStore();
  const { isSignedIn, isLoaded } = useUser();

  // CLERK LOADING
  if (!isLoaded) {
    return (
      <div className= "h-screen bg-black flex items-center justify-center">
        <Loader
          className= "size-8 text-rose-500 animate-spin"/>
      </div>
    );
  }

  // NOT SIGNED IN
  if (!isSignedIn) {
    return (
      <>
        <PageLayout>
          <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* LEFT CONTENT */}
              <div className="text-white space-y-6">
                <div className="space-y-6">
                  <h1 className="text-6xl font-bold leading-tight text-rose-500/70 hover:text-rose-500/50 pl-20">
                    Team Task Manager
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-2 text-lg pl-20">
                {/* Conditional Rendering */}
                {!isSignedIn && <LoginInOAuthButtons />}

                <UserButton />
              </div>
            </div>
          </div>
        </PageLayout>
      </>
    );
  }

  // DASHBOARD STATS
   const totalProgress = tasks.reduce((total, task) => {
     if (task.status === "completed") return total + 100;
     if (task.status === "halfway") return total + 50;
     return total;
   }, 0);
   const progress = tasks.length > 0 ? Math.round(totalProgress / tasks.length) : 0;

   return (
     <PageLayout>
       <div className="p-6 space-y-6">
         <div>
           <h1 className="text-3xl font-bold text-white">Dashboard</h1>
           <p className="text-zinc-200 mt-2">
             Overview of assignments and tasks
           </p>
         </div>

         {(projectsError || tasksError) && (
          <p role="alert" className="text-red-400">
            Unable to load some dashboard data: {projectsError || tasksError}
          </p>
         )}
         {!projectsError && !tasksError && (isProjectsLoading || isTasksLoading) && (
          <p role="status" className="text-zinc-400">
            Loading dashboard data...
          </p>
         )}

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Assignments */}
           <Card className="bg-zinc-900 border-zinc-800 ">
             <CardContent className="p-6 flex items-center justify-between">
               <div>
                 <p className="text-zinc-200 text-sm">Assignments</p>
                 <h2 className="text-3xl font-bold mt-2 text-zinc-400">
                   {projects.length}
                 </h2>
               </div>
               <FolderKanban className="size-8 text-rose-400" />
             </CardContent>
           </Card>

           {/* TASKS */}
           <Card className="bg-zinc-900 border-zinc-800">
             <CardContent className="p-6 flex items-center justify-between">
               <div>
                 <p className="text-zinc-200 text-sm">Tasks</p>
                 <h2 className="text-3xl font-bold mt-2 text-zinc-400">
                   {tasks.length}
                 </h2>
               </div>
               <ClipboardList className="size-8 text-sky-400" />
             </CardContent>
           </Card>

           {/* PROGRESS */}
           <Card className="bg-zinc-900 border-zinc-800">
             <CardContent className="p-6 flex items-center justify-between">
               <div>
                 <p className="text-zinc-200 text-sm">Progress</p>
                 <h2 className="text-3xl font-bold mt-2 text-zinc-400">
                   {progress}%
                 </h2>
               </div>
               <ChartColumn className="size-8 text-green-400" />
             </CardContent>
           </Card>
         </div>
       </div>
     </PageLayout>
   );
};

export default Home;
