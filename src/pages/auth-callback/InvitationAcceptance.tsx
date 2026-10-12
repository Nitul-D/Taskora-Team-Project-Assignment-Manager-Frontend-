import { SignUp } from "@clerk/react";

const InvitationAcceptance = () => (
  <div className="flex min-h-screen items-center justify-center bg-black p-4">
    <SignUp
      path="/accept-invitation"
      routing="path"
      forceRedirectUrl="/auth-callback?invite_complete=1"
      fallbackRedirectUrl="/auth-callback?invite_complete=1"
      signInUrl="/"
    />
  </div>
);

export default InvitationAcceptance;
