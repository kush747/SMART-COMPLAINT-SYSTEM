import api from "./api";

export const userService = {
  async list(params = {}) {
    const { data } = await api.get("/users", { params });
    return data.data;
  },
  async create(payload) {
    const { data } = await api.post("/users", payload);
    return data.data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/users/${id}`, payload);
    return data.data;
  },
  async remove(id) {
    const { data } = await api.delete(`/users/${id}`);
    return data.data;
  }
};
