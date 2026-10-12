import PageLayout from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTaskStore } from "@/stores/useTaskStore";

const ProgressPage = () => {
  const { tasks } = useTaskStore();
  const { isAdmin } = useAuthStore();
  const totalProgress = tasks.reduce((acc, task) => {
    if (task.status === "completed") return acc + 100;
    if (task.status === "halfway") return acc + 50;
    return acc;
  }, 0);

  const progress = tasks.length > 0 ? Math.round(totalProgress / tasks.length) : 0;

  return (
    <PageLayout>
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Progress</h1>
          <p className="text-zinc-400 mt-2">
            {isAdmin
              ? "See Overall Progress of all users"
              : "Your's overall progress"}
          </p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-medium text-white">
                  Overall Progress
                </span>
                <span className="text-2xl font-bold text-white">
                  {progress}%
                </span>
              </div>

              <div className="w-full h-5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ProgressPage;
