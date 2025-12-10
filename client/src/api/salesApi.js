import axiosInstance from "./axiosInstance";

export const getAllSales = async () => {
  try {
    const response = await axiosInstance.get("/sales");
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
    return [];
  }
};

export const addSale = async (saleData) => {
  const response = await axiosInstance.post("/sales", saleData);
  return response.data;
};

export const deleteSale = async (id) => {
  return axiosInstance.delete(`/sales/${id}`);
};
