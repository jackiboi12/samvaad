import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/auth/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/auth");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/auth/outgoing-friend-request");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/auth/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/auth/friend-request");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(
    `/auth/friend-request/${requestId}/accept`
  );
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

export async function updateProfile({ nativeLanguage, learningLanguage }) {
  const response = await axiosInstance.patch("/auth/profile", {
    nativeLanguage,
    learningLanguage,
  });
  return response.data;
}

export async function searchUsers(query) {
  const response = await axiosInstance.get(
    `/auth/search?q=${encodeURIComponent(query)}`
  );
  return response.data;
}

export async function deleteAccount() {
  const response = await axiosInstance.delete("/auth/delete-account");
  return response.data;
}
