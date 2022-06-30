import { useQuery, UseQueryOptions } from "react-query";
import { api } from "../api";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export async function getUsers(page: number = 1) {
  const { data, headers } = await api.get<{ users: User[] }>("/users", {
    params: {
      page,
    },
  });

  const totalCount = Number(headers["x-total-count"]);

  const users = data.users.map(user => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: new Date(user.createdAt).toLocaleDateString("pt-BR", {
        dateStyle: "long",
      }),
    };
  });

  return { users, totalCount };
}

export function useUsers(
  page: number,
  options: UseQueryOptions<unknown, unknown, { users: User[], totalCount: number }>
) {
  return useQuery(["users", page], () => getUsers(page), {
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options,
  });
}
