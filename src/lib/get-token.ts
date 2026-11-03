import { authClient } from "./auth-client";

export async function getToken() {
  const result = await authClient.token();

  return result.data?.token;
}