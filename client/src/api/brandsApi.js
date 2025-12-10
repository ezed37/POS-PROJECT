import axiosInstance from "./axiosInstance";

export const getAllBrand = async () => {
  try {
    const response = await axiosInstance.get("/brands");
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

export const addBrand = async (BrandData) => {
  const response = await axiosInstance.post("/brands", BrandData);
  return response.data;
};

export const deleteBrand = async (id) => {
  return axiosInstance.delete(`/brands/${id}`);
};

export const updateBrand = async (id, updatedBrand) => {
  return axiosInstance.put(`/brands/${id}`, updatedBrand);
};
