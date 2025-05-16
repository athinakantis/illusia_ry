import { api } from "./axios";

export const accountApi = {
  deleteAccount: async () => {
    const response = await api.delete("account/me");
    return response;
  },
  updateName: async (newName: string) => {
    const response = await api.put("account/display-name", {
      newName,
    });
    return response;
  }
};