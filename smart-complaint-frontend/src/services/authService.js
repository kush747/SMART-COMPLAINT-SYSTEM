import api from "./api";

export const authService = {
  async login(payload) {
    const { data } = await api.post("/auth/login", payload);
    return data.data;
  },
  async register(payload) {
    const { data } = await api.post("/auth/register", payload);
   
  },
  async profile() {
    const { data } = await api.get("/users/me");
    return data.data;
  },
  verify:async(email,otp) => {
    const { data } = await api.post("/auth/verify",{email,otp: otp.trim()});
    return data;
  },
  resendOtp: async (email) =>{
    const { data } = await api.post("/auth/resend-otp",{email});
    return data;
  },
  forgotPassword: async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
},
verifyResetOtp: async (email, otp) => {
  const { data } = await api.post("/auth/verify-reset-otp", { email, otp });
  return data;
},
resetPassword: async (email, otp, password, confirmPassword) => {
  const { data } = await api.post("/auth/reset-password", { email, otp, password, confirmPassword });
  return data;
},
  

};
