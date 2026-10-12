import { useClerk } from "@clerk/react";

import { Button } from "./ui/button";

const LoginInOAuthButtons = () => {
  const { redirectToSignIn, loaded } = useClerk();

  if (!loaded) {
    return null;
  }

  const toggleSignIn = () => {
    redirectToSignIn({ redirectUrl: "/auth-callback" });
  };

  return (
    <Button
      onClick={toggleSignIn}
      variant={"secondary"}
      className="px-8 py-6 text-xl font-bold rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-lg transition-all duration-300"
    >
      Login Now
    </Button>
  );
};

export default LoginInOAuthButtons;
