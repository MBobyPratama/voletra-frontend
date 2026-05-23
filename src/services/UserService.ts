import axiosInstance from "@/lib/axios";

export const UserService = {
  updateName: async (name: string): Promise<any> => {
    const response = await axiosInstance.patch("/user/name", { name });
    return response.data;
  },
};
