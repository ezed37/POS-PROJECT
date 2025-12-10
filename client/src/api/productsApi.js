import axiosInstance from "./axiosInstance";

export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const addProduct = async (productData) => {
  const res = await axiosInstance.post("/products", productData);
  return res.data;
};

export const deleteProduct = async (id) => {
  return axiosInstance.delete(`/products/${id}`);
};

export const updateProduct = async (id, updatedProduct) => {
  return axiosInstance.put(`/products/${id}`, updatedProduct);
};

export const updateProductBulk = async (bulkdata) => {
  return axiosInstance.put("/products", bulkdata);
};
