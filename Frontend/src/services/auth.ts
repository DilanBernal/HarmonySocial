import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";

type AnyObj = Record<string, any>;

function extractToken(res: AnyObj): string | null {
  if (typeof res?.token === "string") return res.token;
  if (typeof res?.accessToken === "string") return res.accessToken;
  if (typeof res?.data?.token === "string") return res.data.token;
  if (typeof res?.data?.accessToken === "string") return res.data.accessToken;
  return null;
}

export async function login(userOrEmail: string, password: string) {

  const res = await api.post<AnyObj>("/users/login", { userOrEmail, password });

  const token = extractToken(res);
  if (!token) throw new Error("El backend no devolvió token");

  await AsyncStorage.setItem("token", token);
  if (res.user) await AsyncStorage.setItem("user", JSON.stringify(res.user));
  else if (res.data?.user) await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
  return res;
}
