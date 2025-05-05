import { api } from "./axios";

export const accountApi = {
  deleteAccount: async () => {
    const response = await api.delete("account/me");
    return response;
  }
};