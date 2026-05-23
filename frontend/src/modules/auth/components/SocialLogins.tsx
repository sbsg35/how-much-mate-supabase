import { GoogleButton } from "@/components/GoogleButton";
import { apiUrl } from "@/lib/env";
import { supabaseBrowserClient } from "@/supabase/client";
import { Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { FC } from "react";

export const SocialLogins: FC<{ isSignUp?: boolean }> = ({
  isSignUp = false,
}) => {
  const navigate = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const browserClient = supabaseBrowserClient();
      const { data, error } = await browserClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.error("Error during Google login:", error);
        throw error;
      }
    } catch (error) {
      console.error("Unexpected error during Google login:", error);
      notifications.show({
        title: "Login Failed",
        message: "An error occurred during Google login. Please try again.",
      });
    }
  };

  return (
    <Stack mb="md" mt="md">
      <GoogleButton onClick={handleGoogleLogin}>
        Continue with Google
      </GoogleButton>
      {!isSignUp && (
        // <NextLink href="/auth/passwordless-login">
        //   <Button
        //     variant="outline"
        //     fullWidth
        //     leftSection={<IconWand strokeWidth={1.5} />}
        //   >
        //     Sign in with Magic Link
        //   </Button>
        // </NextLink>
        <></>
      )}
    </Stack>
  );
};
