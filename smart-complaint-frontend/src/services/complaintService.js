import api from "./api";

const paramsFrom = (filters = {}) => Object.fromEntries(
  Object.entries(filters).filter(([, value]) => value !== "" && value !== null && value !== undefined)
);

export const complaintService = {
  async list(filters) {
    const { data } = await api.get("/complaints", { params: paramsFrom(filters) });
    return data.data;
  },
  async mine(params) {
    const { data } = await api.get("/complaints/me", { params });
    return data.data;
  },
  async assigned(params) {
    const { data } = await api.get("/complaints/assigned", { params });
    return data.data;
  },
  async get(id) {
    const { data } = await api.get(`/complaints/${id}`);
    return data.data;
  },
  async create(payload) {
    const { data } = await api.post("/complaints", payload);
    return data.data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/complaints/${id}`, payload);
    return data.data;
  },
  async remove(id, admin = false) {
    const { data } = await api.delete(admin ? `/complaints/admin/${id}` : `/complaints/${id}`);
    return data.data;
  },
  async support(id) {
    const { data } = await api.post(`/complaints/${id}/support`);
    return data.data;
  },
  async removeSupport(id) {
    const { data } = await api.delete(`/complaints/${id}/support`);
    return data.data;
  },
  async updateStatus(id, status) {
    const { data } = await api.patch(`/complaints/${id}/status`, { status });
    return data.data;
  },
  async assignOfficer(id, officerId) {
    const { data } = await api.patch(`/complaints/${id}/assign`, { officerId });
    return data.data;
  },
  async addRemark(id, comment) {
    const { data } = await api.post(`/complaints/${id}/remarks`, { comment });
    return data.data;
  }
};
