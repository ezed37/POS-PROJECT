import axiosInstance from "./axiosInstance";

export const getUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
};

export const addUser = async (userData) => {
  const res = await axiosInstance.post("/users/register", userData);
  return res.data;
};

export const deleteUser = async (id) => {
  return axiosInstance.delete(`/users/${id}`);
};

export const updateUser = async (id, updatedData) => {
  return axiosInstance.put(`/users/${id}`, updatedData);
};
