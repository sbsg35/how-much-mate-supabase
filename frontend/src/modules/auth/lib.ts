import { useLocalStorage } from "@mantine/hooks";

export const useAccessTokenLocalStorage = () => {
  const [accessToken, setAccessToken, removeAccessToken] = useLocalStorage<
    string | undefined
  >({
    key: "accessToken",
  });

  return {
    accessToken,
    setAccessToken,
    removeAccessToken,
  };
};
