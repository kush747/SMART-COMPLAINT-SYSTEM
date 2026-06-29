import api from "./api";

export const dashboardService = {
  async user() {
    const { data } = await api.get("/dashboards/user");
    return data.data;
  },
  async officer() {
    const { data } = await api.get("/dashboards/officer");
    return data.data;
  },
  async admin() {
    const { data } = await api.get("/dashboards/admin");
    return data.data;
  }
};
