import { authApi } from "@/entities/auth/api";
import { IUser } from "@/types/user";

const roleChecker = {
  async getUser(): Promise<IUser> {
    return await authApi.endpoints.getMe();
  },

  async ADMIN() {
    const user = await this.getUser();
    return user.role === "ADMIN";
  },

  async STUDENT() {
    const user = await this.getUser();
    return user.role === "STUDENT";
  },

  async TEACHER() {
    const user = await this.getUser();
    return user.role === "TEACHER";
  },
};

export default roleChecker;
