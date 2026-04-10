import { GoogleButton } from "@/components/GoogleButton";
import { apiUrl } from "@/lib/env";
import { Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import { FC } from "react";

export const SocialLogins: FC<{ isSignUp?: boolean }> = ({
  isSignUp = false,
}) => {
  const navigate = useRouter();

  return (
    <Stack mb="md" mt="md">
      <GoogleButton onClick={() => navigate.push(`${apiUrl}/auth/google`)}>
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
