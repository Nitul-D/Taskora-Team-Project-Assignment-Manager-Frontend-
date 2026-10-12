import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { axiosConnection } from "@/lib/axios";
import { useClerk } from "@clerk/react";
import { Loader, RotateCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const { loaded, user } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const syncAttempted = useRef(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const syncUser = useCallback(async () => {
    if (!loaded || !user || syncAttempted.current) return;

    syncAttempted.current = true;
    setSyncError(null);
    try {
      await axiosConnection.post("/auth/callback", {});
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error syncing authenticated user:", error);
      syncAttempted.current = false;
      setSyncError(
        "Your sign-up completed, but we couldn't finish setting up your account. Please try again.",
      );
    }
  }, [loaded, navigate, user]);

  useEffect(() => {
    if (!loaded) return;

    const searchParams = new URLSearchParams(location.search);
    const invitationTicket = searchParams.get("__clerk_ticket");
    const invitationStatus = searchParams.get("__clerk_status");

    if (invitationTicket && invitationStatus === "sign_up") {
      navigate(`/accept-invitation${location.search}`, { replace: true });
      return;
    }

    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void syncUser();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loaded, location.search, navigate, syncUser, user]);

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <Card className="w-[90%] max-w-md bg-zinc-900 border-zinc-800">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          {syncError ? (
            <RotateCw className="size-8 text-rose-500" />
          ) : (
            <Loader className="size-8 animate-spin text-rose-500" />
          )}
          {syncError ? (
            <>
              <h3 className="text-center text-xl font-bold text-white">
                Account setup needs another try
              </h3>
              <p role="alert" className="text-center text-sm text-zinc-400">
                {syncError}
              </p>
              <Button
                type="button"
                onClick={() => void syncUser()}
                className="bg-rose-500 text-white hover:bg-rose-600"
              >
                <RotateCw className="size-4" />
                Retry account setup
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-zinc-400 text-xl font-bold">Logging you in</h3>
              <p className="text-zinc-400 text-sm">Finishing account setup...</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
