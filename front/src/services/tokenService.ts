import api from "./api";

export const tokenService = {
  setAccessToken: (accessToken: string) => {
    localStorage.setItem("accessToken", accessToken);
  },

  getAccessToken: () => localStorage.getItem("accessToken"),

  clearTokens: () => {
    localStorage.removeItem("accessToken");
  },

  refreshTokens: async () => {
    try {
      const response = await api.post(`/auth/refresh`);

      const { access_token } = response.data;
      tokenService.setAccessToken(access_token);
      return access_token;
    } catch (error: any) {
      if (error.response?.status === 401) {
        tokenService.clearTokens();
        window.location.href = "/login";
      }
      throw error;
    }
  },
};
