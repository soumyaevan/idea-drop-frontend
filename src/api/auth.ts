import api from "@/lib/axios";
type RegisterResponse = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};
export const registerUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> => {
  try {
    const res = await api.post("/auth/register", { name, email, password });
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 400) {
      throw new Error("Invalid registration data");
    } else if (err.response?.status === 409) {
      throw new Error("Email already exists");
    }
    throw new Error("Registration failed. Please try again.");
  }
};

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<RegisterResponse> => {
  try {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  } catch (err: any) {
    throw new Error("Login is failed");
  }
};

export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err: any) {
    throw new Error("Logout is failed");
  }
};

export const refreshAccessToken = async () => {
  try {
    const res = await api.post("/auth/refresh");
    return res.data;
  } catch (err: any) {
    throw new Error("Failed to get refresh token");
  }
};
