import axiosInstance from "./axiosInstance";

export const getAllCustomers = async () => {
  try {
    const response = await axiosInstance.get("/customers");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const addCustomer = async (customerData) => {
  const res = await axiosInstance.post("/customers", customerData);
  return res.data;
};

export const deleteCustomer = async (id) => {
  return axiosInstance.delete(`/customers/${id}`);
};

export const updateCustomer = async (id, customerData) => {
  return axiosInstance.put(`/customers/${id}`, customerData);
};
